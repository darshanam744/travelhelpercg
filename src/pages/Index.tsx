
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import VoiceInput from '@/components/VoiceInput';
import QueryResult from '@/components/QueryResult';
import SettingsDialog from '@/components/SettingsDialog';
import { searchTransportRoutes, TransportRoute } from '@/services/transportService';
import { mockDwaniResponse } from '@/services/dwaniService';
import { toast } from 'sonner';
import { BookOpen, Command, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const DEFAULT_LANGUAGE = 'en';

interface ExampleQuery {
  text: string;
  language: string;
}

const exampleQueries: ExampleQuery[] = [
  { text: "When is the next bus to Vidhana Soudha?", language: 'en' },
  { text: "विधान सौध जाने वाली अगली बस कब है?", language: 'hi' },
  { text: "ವಿಧಾನ ಸೌಧಕ್ಕೆ ಮುಂದಿನ ಬಸ್ ಯಾವಾಗ?", language: 'kn' }
];

const Index: React.FC = () => {
  const [transcript, setTranscript] = useState<string>('');
  const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [results, setResults] = useState<TransportRoute[]>([]);
  const [apiKey, setApiKey] = useState<string>('');
  
  // Load API key from local storage
  useEffect(() => {
    const storedApiKey = localStorage.getItem('dwaniApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);
  
  // Handle transcript processing
  const handleTranscript = async (text: string) => {
    setTranscript(text);
    
    // In a real app, this would use the actual Dwani API response
    // For now, we're using the mock data
    try {
      const response = await searchTransportRoutes(text);
      setResults(response.routes);
      
      if (response.routes.length === 0 && response.intent === 'transport_search') {
        toast.info("No routes found matching your query. Try another destination.");
      }
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Sorry, there was an error processing your query.');
      setResults([]);
    }
  };
  
  // Handle example query click
  const handleExampleClick = (query: ExampleQuery) => {
    setLanguage(query.language);
    handleTranscript(query.text);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container max-w-2xl py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">द्वानी Yatra</h1>
          <div className="flex items-center space-x-2">
            <Link to="/about">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
                <span className="sr-only">About</span>
              </Button>
            </Link>
            <SettingsDialog apiKey={apiKey} setApiKey={setApiKey} />
          </div>
        </div>
        
        <div className="text-center mb-10">
          <h2 className="text-xl font-medium mb-2">Voice-Based Transport Queries</h2>
          <p className="text-muted-foreground">
            Ask about bus, train, or metro schedules using your voice in Kannada, Hindi, or English
          </p>
          
          {!apiKey && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md text-amber-800 dark:text-amber-300 text-sm">
              Please set your Dwani AI API key in the settings to use voice recognition features.
            </div>
          )}
        </div>
        
        <div className="mb-10">
          <VoiceInput 
            onTranscript={handleTranscript}
            language={language}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </div>
        
        <QueryResult 
          query={transcript}
          results={results}
          language={language}
        />
        
        <div className="mt-12">
          <div className="flex items-center mb-4 space-x-3">
            <Command className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-medium">Try these examples</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {exampleQueries.map((query, index) => (
              <button 
                key={index}
                onClick={() => handleExampleClick(query)}
                className="p-3 text-left rounded-md border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <p className="font-medium">{query.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {query.language === 'en' ? 'English' : query.language === 'hi' ? 'Hindi' : 'Kannada'}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            This project integrates AI with Indian Knowledge Systems (IKS)
          </p>
          <Link to="/about" className="inline-flex items-center mt-2 text-sm text-primary hover:underline">
            <BookOpen className="h-4 w-4 mr-1" />
            Learn more about this project
          </Link>
        </div>
      </main>
      
      <footer className="py-4 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 द्वानी Yatra</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
