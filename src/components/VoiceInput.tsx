
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language: string;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onTranscript, 
  language, 
  isProcessing,
  setIsProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        processAudio(audioBlob);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const processAudio = async (audioBlob: Blob) => {
    // Mock implementation - will replace with actual Dwani API call
    setIsProcessing(true);
    
    try {
      // This would be replaced with actual API call
      setTimeout(() => {
        const mockTranscripts = {
          'en': 'When is the next bus to Vidhana Soudha?',
          'hi': 'विधान सौध जाने वाली अगली बस कब है?',
          'kn': 'ವಿಧಾನ ಸೌಧಕ್ಕೆ ಮುಂದಿನ ಬಸ್ ಯಾವಾಗ?'
        };
        
        onTranscript(mockTranscripts[language as keyof typeof mockTranscripts] || mockTranscripts.en);
        setIsProcessing(false);
      }, 2000);
      
      // Actual implementation would look like this:
      /*
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);
      
      const response = await fetch('YOUR_DWANI_API_ENDPOINT', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${process.env.DWANI_API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to process audio');
      }
      
      const data = await response.json();
      onTranscript(data.transcript);
      */
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process your speech. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center transition-all",
          isRecording ? "bg-red-100 dark:bg-red-950" : "bg-muted",
          isProcessing ? "opacity-70" : "opacity-100"
        )}>
          {isProcessing ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : (
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              size="icon"
              className={cn(
                "h-20 w-20 rounded-full",
                isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
              )}
            >
              {isRecording ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </Button>
          )}
        </div>
        
        {isRecording && (
          <>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-red-500 animate-pulse-ring"></div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex">
              <div className="wave-bar animate-wave-1"></div>
              <div className="wave-bar animate-wave-2"></div>
              <div className="wave-bar animate-wave-3"></div>
              <div className="wave-bar animate-wave-4"></div>
              <div className="wave-bar animate-wave-5"></div>
            </div>
          </>
        )}
      </div>
      
      <p className="mt-16 text-center text-muted-foreground">
        {isProcessing ? 'Processing your query...' : 
          isRecording ? 'Listening...' : 'Tap to speak'}
      </p>
    </div>
  );
};

export default VoiceInput;
