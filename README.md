
# वाणी Yatra (Vāṇī Yatra) - Voice-Based Public Transport Query System

An AI-powered, voice-based public transport query system that supports Kannada, Hindi, and English, and is deeply rooted in the principles of Indian Knowledge Systems (IKS).

## Overview

This project creates an intuitive voice interface for accessing bus/train timings, route information, and transit guidance, especially empowering those with limited digital or textual literacy. Users can speak their queries in their preferred language, and the system will understand their intent and provide relevant transportation information.

## Features

- **Multilingual Voice Interface**: Supports Kannada, Hindi, and English
- **Public Transport Queries**: Get information about buses, trains, and metros
- **Cultural Context**: Understands landmark-based navigation and local context
- **Accessible Design**: Simple, intuitive interface that works well on all devices

## Technology Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- Voice input and processing

### Backend (Reference Implementation)
- Flask (Python)
- SQLite for database
- Render for deployment

## Setup and Installation

### Prerequisites
- Node.js and npm
- Dwani AI API key (sign up at [Dwani.ai](https://dwani.ai))

### Frontend Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd vani-yatra
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

5. Add your Dwani AI API key in the Settings dialog within the app

### Backend Setup (For Full Implementation)

Refer to the `backend_structure.md` file for detailed instructions on setting up the Flask backend.

## Integrating with Dwani AI

This project uses the Dwani AI API for speech recognition and natural language understanding. To successfully integrate with Dwani AI:

1. Sign up for a Dwani AI account and obtain an API key
2. Enter your API key in the app's settings
3. The app will send audio recordings to the Dwani API for processing
4. The API returns the transcript along with detected intents and entities
5. The app uses this information to search for relevant transport routes

## Project Structure

```
project/
├── src/
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Application entry point
├── backend_structure.md   # Reference for backend implementation
└── README.md              # Project documentation
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production-ready application
- `npm run preview` - Preview the production build locally

## Extending the Project

### Additional Languages
To add more languages, extend the `LanguageSelector` component and add corresponding mock responses in the services.

### Backend Integration
Follow the guidance in `backend_structure.md` to implement a Flask backend that:
1. Handles audio processing with Dwani AI
2. Stores and retrieves transport route information
3. Processes intents and entities to provide relevant responses

### Cultural Context Enhancement
Consider enhancing the system with:
1. Landmark-based navigation database
2. Festival calendar for culturally-aware routing
3. Local dialect and expression handling

## IKS Integration Points

- **Semantic Models**: Leverage traditional direction and classification systems
- **Linguistic Preservation**: Promote regional transport terms and expressions
- **Cultural Awareness**: Align system behavior with local festivals and daily rhythms
- **Traditional Knowledge Base**: Embed common navigation heuristics and local insight

## License

This project is open-source and available under the MIT License.

## Acknowledgements

- Dwani AI for multilingual speech processing capabilities
- Indian Knowledge Systems for cultural and contextual framework
