
// In a real implementation, this would connect to your Flask backend
// For now, we'll mock the transport data

export interface TransportRoute {
  id: string;
  type: 'bus' | 'train' | 'metro';
  number: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  status: 'on-time' | 'delayed' | 'cancelled';
}

export interface QueryResponse {
  routes: TransportRoute[];
  intent: string;
  entities: Record<string, string>;
}

// Mock data
const mockRoutes: TransportRoute[] = [
  {
    id: '1',
    type: 'bus',
    number: '335E',
    from: 'Majestic Bus Station',
    to: 'Vidhana Soudha',
    departureTime: '10:15 AM',
    arrivalTime: '10:45 AM',
    duration: '30 min',
    stops: 6,
    status: 'on-time'
  },
  {
    id: '2',
    type: 'bus',
    number: '500C',
    from: 'Majestic Bus Station',
    to: 'Vidhana Soudha',
    departureTime: '10:30 AM',
    arrivalTime: '11:00 AM',
    duration: '30 min',
    stops: 4,
    status: 'on-time'
  },
  {
    id: '3',
    type: 'metro',
    number: 'Purple Line',
    from: 'Majestic Metro',
    to: 'Vidhana Soudha',
    departureTime: '10:05 AM',
    arrivalTime: '10:15 AM',
    duration: '10 min',
    stops: 1,
    status: 'delayed'
  }
];

// For demonstration purposes - maps common landmarks to destinations
const landmarkMap: Record<string, string> = {
  'vidhana soudha': 'Vidhana Soudha',
  'vidhan soudha': 'Vidhana Soudha',
  'majestic': 'Majestic Bus Station',
  'kempegowda': 'Kempegowda Bus Station',
  'hebbal': 'Hebbal',
  'electronic city': 'Electronic City',
  'silk board': 'Silk Board',
  'whitefield': 'Whitefield',
  'airport': 'Kempegowda International Airport',
  'kr market': 'KR Market',
  'mysore road': 'Mysore Road',
};

export const searchTransportRoutes = async (query: string): Promise<QueryResponse> => {
  // In a real implementation, this would send the query to your Flask backend
  // For now, we'll mock the response based on the query

  // Simple mock intent detection - a real implementation would use NLP
  const queryLower = query.toLowerCase();
  let intent = 'unknown';
  const entities: Record<string, string> = {};
  
  if (queryLower.includes('bus') || queryLower.includes('train') || queryLower.includes('metro')) {
    intent = 'transport_search';
    
    // Extract transport type
    if (queryLower.includes('bus')) entities.transportType = 'bus';
    if (queryLower.includes('train')) entities.transportType = 'train';
    if (queryLower.includes('metro')) entities.transportType = 'metro';
  }
  
  // Simple destination extraction from landmarks
  Object.entries(landmarkMap).forEach(([key, value]) => {
    if (queryLower.includes(key)) {
      intent = 'transport_search';
      entities.destination = value;
    }
  });
  
  // Mock time extraction
  if (queryLower.includes('next')) {
    entities.timeFrame = 'next';
  } else if (queryLower.includes('morning')) {
    entities.timeFrame = 'morning';
  } else if (queryLower.includes('evening')) {
    entities.timeFrame = 'evening';
  }
  
  // Wait a bit to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    routes: entities.destination === 'Vidhana Soudha' ? mockRoutes : [],
    intent,
    entities
  };
};

// In a real implementation, this would be replaced with actual API call to Dwani AI
export const processAudioWithDwaniAPI = async (audioBlob: Blob, language: string): Promise<string> => {
  // Simulate API processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock transcripts for demonstration
  const mockTranscripts: Record<string, string> = {
    'en': 'When is the next bus to Vidhana Soudha?',
    'hi': 'विधान सौध जाने वाली अगली बस कब है?',
    'kn': 'ವಿಧಾನ ಸೌಧಕ್ಕೆ ಮುಂದಿನ ಬಸ್ ಯಾವಾಗ?'
  };
  
  return mockTranscripts[language] || mockTranscripts.en;
  
  /*
  // Actual implementation would look like:
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('language', language);
  
  const response = await fetch('https://your-dwani-api-endpoint/transcribe', {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${DWANI_API_KEY}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to process audio with Dwani API');
  }
  
  const data = await response.json();
  return data.transcript;
  */
};
