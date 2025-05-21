
// Interface for the Dwani API response
export interface DwaniResponse {
  transcript: string;
  confidence: number;
  language: string;
  intent?: {
    name: string;
    confidence: number;
  };
  entities?: Array<{
    entity: string;
    value: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

/**
 * Process audio with Dwani API for speech-to-text and intent recognition
 * 
 * @param audioBlob - Audio blob from microphone recording
 * @param language - ISO language code ('en', 'hi', 'kn')
 * @param apiKey - Your Dwani API key
 * @returns Promise with the processed transcript and extracted information
 */
export const processSpeechWithDwani = async (
  audioBlob: Blob, 
  language: string,
  apiKey: string
): Promise<DwaniResponse> => {
  // In production, this key would be stored securely
  if (!apiKey) {
    throw new Error('Dwani API key is required');
  }
  
  try {
    // Convert the blob to base64 for API transmission
    const base64Audio = await blobToBase64(audioBlob);
    
    const response = await fetch('https://api.dwani.ai/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        audio: {
          content: base64Audio.split(',')[1] // Remove the data URL prefix
        },
        config: {
          language: {
            code: language // en-IN, hi-IN, kn-IN
          },
          model: 'default', // Use the appropriate Dwani model
          enable_intent_recognition: true,
          enable_entity_extraction: true
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Dwani API error: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error processing speech with Dwani:', error);
    throw error;
  }
};

/**
 * Helper function to convert a Blob to base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
  });
};

/**
 * For development and testing without actual API calls
 */
export const mockDwaniResponse = (language: string): DwaniResponse => {
  const responses: Record<string, DwaniResponse> = {
    'en': {
      transcript: 'When is the next bus to Vidhana Soudha?',
      confidence: 0.95,
      language: 'en-IN',
      intent: {
        name: 'transport_schedule_query',
        confidence: 0.92
      },
      entities: [
        {
          entity: 'transport_type',
          value: 'bus',
          start: 17,
          end: 20,
          confidence: 0.97
        },
        {
          entity: 'destination',
          value: 'Vidhana Soudha',
          start: 24,
          end: 38,
          confidence: 0.98
        },
        {
          entity: 'time_reference',
          value: 'next',
          start: 12,
          end: 16,
          confidence: 0.95
        }
      ]
    },
    'hi': {
      transcript: 'विधान सौध जाने वाली अगली बस कब है?',
      confidence: 0.92,
      language: 'hi-IN',
      intent: {
        name: 'transport_schedule_query',
        confidence: 0.9
      },
      entities: [
        {
          entity: 'destination',
          value: 'विधान सौध',
          start: 0,
          end: 10,
          confidence: 0.94
        },
        {
          entity: 'transport_type',
          value: 'बस',
          start: 25,
          end: 27,
          confidence: 0.97
        },
        {
          entity: 'time_reference',
          value: 'अगली',
          start: 21,
          end: 25,
          confidence: 0.93
        }
      ]
    },
    'kn': {
      transcript: 'ವಿಧಾನ ಸೌಧಕ್ಕೆ ಮುಂದಿನ ಬಸ್ ಯಾವಾಗ?',
      confidence: 0.9,
      language: 'kn-IN',
      intent: {
        name: 'transport_schedule_query',
        confidence: 0.89
      },
      entities: [
        {
          entity: 'destination',
          value: 'ವಿಧಾನ ಸೌಧ',
          start: 0,
          end: 10,
          confidence: 0.92
        },
        {
          entity: 'transport_type',
          value: 'ಬಸ್',
          start: 19,
          end: 22,
          confidence: 0.95
        },
        {
          entity: 'time_reference',
          value: 'ಮುಂದಿನ',
          start: 11,
          end: 18,
          confidence: 0.91
        }
      ]
    }
  };
  
  return responses[language] || responses['en'];
};
