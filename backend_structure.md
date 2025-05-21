
# वाणी Yatra Backend Structure

This file outlines how to structure the Flask backend for the वाणी Yatra project.

## Setup Instructions

1. **Install required packages:**
```bash
pip install Flask flask-cors python-dotenv requests SQLite3
```

2. **Project structure:**
```
backend/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── routes/             # API routes
│   ├── __init__.py
│   └── transport.py    # Transport routes endpoints
├── services/           # Business logic
│   ├── __init__.py
│   ├── dwani_service.py  # Dwani API integration
│   └── transport_service.py  # Transport data processing
├── models/             # Database models
│   ├── __init__.py
│   ├── route.py        # Route model
│   └── stop.py         # Stop model
├── utils/              # Utility functions
│   ├── __init__.py
│   └── helpers.py      # Helper functions
└── database/           # SQLite database
    └── transport.db    # Database file
```

3. **Main application (app.py):**
```python
from flask import Flask
from flask_cors import CORS
import os
from routes import transport
from config import Config

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register routes
app.register_blueprint(transport.bp, url_prefix='/api/transport')

@app.route('/')
def index():
    return {"status": "API is running"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

4. **Dwani API Integration (services/dwani_service.py):**
```python
import requests
import base64
import os
from config import Config

class DwaniService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get('DWANI_API_KEY')
        self.base_url = "https://api.dwani.ai/v1"
        
    def process_audio(self, audio_data, language):
        """
        Process audio with Dwani API
        
        Args:
            audio_data: Base64 encoded audio data
            language: Language code (en-IN, hi-IN, kn-IN)
            
        Returns:
            Processed response with transcript and NLU data
        """
        try:
            url = f"{self.base_url}/speech-to-text"
            
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            
            payload = {
                "audio": {
                    "content": audio_data
                },
                "config": {
                    "language": {
                        "code": language
                    },
                    "model": "default",
                    "enable_intent_recognition": True,
                    "enable_entity_extraction": True
                }
            }
            
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            return response.json()
            
        except requests.exceptions.RequestException as e:
            print(f"Error calling Dwani API: {e}")
            raise
```

5. **Transport service (services/transport_service.py):**
```python
import sqlite3
from datetime import datetime, timedelta
import os

class TransportService:
    def __init__(self, db_path=None):
        self.db_path = db_path or os.path.join(os.path.dirname(__file__), '../database/transport.db')
        
    def _get_db_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
        
    def search_routes(self, from_location=None, to_location=None, time=None, route_type=None):
        """
        Search for transport routes based on query parameters
        
        Args:
            from_location: Starting location
            to_location: Destination location
            time: Departure time (defaults to current time)
            route_type: Type of transport (bus, train, metro)
            
        Returns:
            List of matching routes
        """
        conn = self._get_db_connection()
        
        query = """
            SELECT r.id, r.route_number, r.type, r.from_location, r.to_location, 
                   s.departure_time, s.arrival_time, s.stops, s.status
            FROM routes r
            JOIN schedules s ON r.id = s.route_id
            WHERE 1=1
        """
        params = []
        
        if to_location:
            query += " AND r.to_location LIKE ?"
            params.append(f'%{to_location}%')
            
        if from_location:
            query += " AND r.from_location LIKE ?"
            params.append(f'%{from_location}%')
            
        if route_type:
            query += " AND r.type = ?"
            params.append(route_type)
            
        if time:
            query += " AND s.departure_time >= ?"
            params.append(time)
        else:
            current_time = datetime.now().strftime('%H:%M')
            query += " AND s.departure_time >= ?"
            params.append(current_time)
            
        # Order by departure time
        query += " ORDER BY s.departure_time ASC LIMIT 10"
        
        try:
            cursor = conn.cursor()
            cursor.execute(query, params)
            routes = cursor.fetchall()
            
            result = []
            for route in routes:
                result.append({
                    "id": route['id'],
                    "type": route['type'],
                    "number": route['route_number'],
                    "from": route['from_location'],
                    "to": route['to_location'],
                    "departureTime": route['departure_time'],
                    "arrivalTime": route['arrival_time'],
                    "stops": route['stops'],
                    "status": route['status'],
                    "duration": self._calculate_duration(route['departure_time'], route['arrival_time'])
                })
                
            return result
            
        finally:
            conn.close()
    
    def _calculate_duration(self, departure, arrival):
        """Calculate duration between departure and arrival times"""
        dep_time = datetime.strptime(departure, '%H:%M')
        arr_time = datetime.strptime(arrival, '%H:%M')
        
        if arr_time < dep_time:  # Handle overnight trips
            arr_time += timedelta(days=1)
            
        duration = arr_time - dep_time
        minutes = duration.seconds // 60
        
        if minutes < 60:
            return f"{minutes} min"
        else:
            hours = minutes // 60
            remaining_mins = minutes % 60
            return f"{hours} hr {remaining_mins} min"
```

6. **API routes (routes/transport.py):**
```python
from flask import Blueprint, request, jsonify
from services.transport_service import TransportService
from services.dwani_service import DwaniService
import base64
import os

bp = Blueprint('transport', __name__)
transport_service = TransportService()
dwani_service = DwaniService()

@bp.route('/routes', methods=['GET'])
def get_routes():
    """Get transport routes based on query parameters"""
    from_location = request.args.get('from')
    to_location = request.args.get('to')
    time = request.args.get('time')
    route_type = request.args.get('type')
    
    try:
        routes = transport_service.search_routes(
            from_location=from_location,
            to_location=to_location,
            time=time,
            route_type=route_type
        )
        
        return jsonify({
            "routes": routes,
            "count": len(routes)
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Failed to retrieve routes"
        }), 500

@bp.route('/process-speech', methods=['POST'])
def process_speech():
    """Process speech audio with Dwani API"""
    if not request.json or 'audio' not in request.json:
        return jsonify({
            "error": "Missing required audio data"
        }), 400
        
    audio_data = request.json['audio']
    language = request.json.get('language', 'en-IN')
    
    try:
        # Process with Dwani API
        response = dwani_service.process_audio(audio_data, language)
        
        # Extract intent and entities
        transcript = response.get('transcript', '')
        intent = response.get('intent', {}).get('name', '')
        entities = response.get('entities', [])
        
        # If transport intent is detected, search for routes
        routes = []
        if intent.startswith('transport'):
            # Extract destination from entities
            destination = None
            for entity in entities:
                if entity['entity'] == 'destination':
                    destination = entity['value']
                    break
                    
            if destination:
                routes = transport_service.search_routes(to_location=destination)
        
        return jsonify({
            "transcript": transcript,
            "intent": intent,
            "entities": entities,
            "routes": routes
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "Failed to process speech"
        }), 500
```

7. **Database setup:**
```sql
-- Create tables for routes and schedules
CREATE TABLE routes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_number TEXT NOT NULL,
    type TEXT CHECK(type IN ('bus', 'train', 'metro')) NOT NULL,
    from_location TEXT NOT NULL,
    to_location TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id INTEGER NOT NULL,
    departure_time TEXT NOT NULL, -- Format: HH:MM
    arrival_time TEXT NOT NULL,   -- Format: HH:MM
    stops INTEGER DEFAULT 0,
    status TEXT DEFAULT 'on-time' CHECK(status IN ('on-time', 'delayed', 'cancelled')),
    FOREIGN KEY (route_id) REFERENCES routes (id)
);

-- Add some sample routes
INSERT INTO routes (route_number, type, from_location, to_location)
VALUES 
    ('335E', 'bus', 'Majestic Bus Station', 'Vidhana Soudha'),
    ('500C', 'bus', 'Majestic Bus Station', 'Vidhana Soudha'),
    ('Purple Line', 'metro', 'Majestic Metro', 'Vidhana Soudha'),
    ('276B', 'bus', 'Majestic Bus Station', 'Electronic City'),
    ('KJF Pass', 'train', 'Bangalore City Station', 'Whitefield');

-- Add some sample schedules
INSERT INTO schedules (route_id, departure_time, arrival_time, stops, status)
VALUES
    (1, '10:15', '10:45', 6, 'on-time'),
    (1, '11:15', '11:45', 6, 'on-time'),
    (1, '12:15', '12:45', 6, 'on-time'),
    (2, '10:30', '11:00', 4, 'on-time'),
    (2, '11:30', '12:00', 4, 'delayed'),
    (3, '10:05', '10:15', 1, 'delayed'),
    (3, '10:25', '10:35', 1, 'on-time'),
    (4, '09:30', '10:45', 12, 'on-time'),
    (5, '08:20', '09:15', 5, 'on-time');
```

## Deploying to Render

1. Create a `requirements.txt` file with all dependencies:
```
Flask==2.0.1
flask-cors==3.0.10
python-dotenv==0.19.0
requests==2.26.0
gunicorn==20.1.0
```

2. Create a `render.yaml` file for Render deployment:
```yaml
services:
  - type: web
    name: vani-yatra-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    envVars:
      - key: DWANI_API_KEY
        sync: false
```

3. Set up a new web service in Render, connect to your GitHub repository, and deploy.

## Integration with Dwani API

To successfully integrate with the Dwani API:

1. Sign up for a Dwani AI account and obtain an API key
2. Set the API key as an environment variable (`DWANI_API_KEY`)
3. Use the included DwaniService class to make API calls
4. Process the returned transcripts and intent recognition data 
5. Connect the intents to your transport search functionality

The frontend application you've built will communicate with this Flask backend through API calls, sending audio data and receiving transcripts and transport information.
