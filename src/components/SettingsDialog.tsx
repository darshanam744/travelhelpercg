
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsDialogProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ apiKey, setApiKey }) => {
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('dwaniApiKey', tempApiKey);
    toast.success('Settings saved successfully');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Dwani AI API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Dwani AI API key"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and is not sent to our servers.
              Get your API key from <a href="https://dwani.ai" target="_blank" rel="noreferrer" className="underline">Dwani.ai</a>
            </p>
          </div>
          <Button onClick={handleSave} className="w-full">Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
