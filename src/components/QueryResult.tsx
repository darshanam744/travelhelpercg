
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, Train, AlertTriangle, Clock, Map, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TransportRoute {
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

interface QueryResultProps {
  query: string;
  results: TransportRoute[];
  language: string;
}

const ResultCard: React.FC<{ route: TransportRoute }> = ({ route }) => {
  const getIcon = () => {
    switch (route.type) {
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'train':
      case 'metro':
        return <Train className="h-5 w-5" />;
      default:
        return <Bus className="h-5 w-5" />;
    }
  };
  
  const getStatusColor = () => {
    switch (route.status) {
      case 'on-time':
        return 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400';
      case 'delayed':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400';
      default:
        return '';
    }
  };
  
  return (
    <Card className="mb-3 overflow-hidden hover:shadow-md transition-shadow">
      <div className={cn(
        "h-2 w-full",
        route.type === 'bus' ? "bg-iks-green" : 
        route.type === 'train' ? "bg-iks-blue" : "bg-iks-chakra"
      )}/>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-full",
              route.type === 'bus' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : 
              route.type === 'train' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : 
              "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
            )}>
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold">{route.type.toUpperCase()} {route.number}</h3>
              <p className="text-sm text-muted-foreground">{route.from} → {route.to}</p>
            </div>
          </div>
          <div>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor()
            )}>
              {route.status === 'on-time' ? 'On Time' : 
               route.status === 'delayed' ? 'Delayed' : 'Cancelled'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col items-center border rounded-md p-2">
            <Clock className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Departure</span>
            <span className="font-medium">{route.departureTime}</span>
          </div>
          <div className="flex flex-col items-center border rounded-md p-2">
            <Clock className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Arrival</span>
            <span className="font-medium">{route.arrivalTime}</span>
          </div>
          <div className="flex flex-col items-center border rounded-md p-2">
            <Map className="h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Stops</span>
            <span className="font-medium">{route.stops}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm"><span className="text-muted-foreground">Duration:</span> {route.duration}</p>
          <Button variant="outline" size="sm">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const QueryResult: React.FC<QueryResultProps> = ({ query, results, language }) => {
  if (!query || results.length === 0) {
    return null;
  }
  
  const renderNoResults = () => {
    const messages = {
      en: "Sorry, no routes found matching your query.",
      hi: "क्षमा करें, आपकी क्वेरी से मिलते-जुलते कोई मार्ग नहीं मिले।",
      kn: "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಮಾರ್ಗಗಳು ಕಂಡುಬಂದಿಲ್ಲ."
    };
    
    return (
      <div className="flex flex-col items-center py-8">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {messages[language as keyof typeof messages] || messages.en}
        </p>
      </div>
    );
  };
  
  return (
    <div className="mt-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Query Results</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span className="italic">"{query}"</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? 
            results.map((route) => (
              <ResultCard key={route.id} route={route} />
            )) : renderNoResults()}
        </CardContent>
      </Card>
    </div>
  );
};

export default QueryResult;
