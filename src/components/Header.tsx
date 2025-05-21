
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Header: React.FC<HeaderProps> = ({ className, ...props }) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <header 
      className={cn("w-full border-b sticky top-0 z-30 bg-background flex items-center justify-between px-6 py-3", 
      className)} 
      {...props}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-iks-saffron flex items-center justify-center">
          <span className="text-white font-bold">द्व</span>
        </div>
        <h1 className="text-xl font-bold">वाणी Yatra</h1>
      </div>

      <div className="flex items-center space-x-4">
        <LanguageSelector />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

const LanguageSelector: React.FC = () => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
  ];
  
  const [selectedLang, setSelectedLang] = React.useState('en');

  return (
    <div className="flex space-x-1">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={selectedLang === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedLang(lang.code)}
          className={cn(
            "text-sm px-3",
            selectedLang === lang.code ? "bg-primary text-primary-foreground" : ""
          )}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
};

export default Header;
