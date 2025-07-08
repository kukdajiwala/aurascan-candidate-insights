import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Key, Eye, EyeOff } from 'lucide-react';
import { initializeOpenAI } from '@/lib/openai';
import { useToast } from "@/hooks/use-toast";

interface OpenAISetupProps {
  onSetupComplete: () => void;
}

const OpenAISetup: React.FC<OpenAISetupProps> = ({ onSetupComplete }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Initialize OpenAI with the provided key
      initializeOpenAI(apiKey.trim());
      
      // Store in localStorage for session persistence
      localStorage.setItem('openai_api_key', apiKey.trim());
      
      toast({
        title: "OpenAI Connected",
        description: "AI analysis is now ready"
      });
      
      onSetupComplete();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md floating-card">
        <CardHeader className="text-center">
          <Key className="h-12 w-12 text-aura-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">OpenAI Setup Required</CardTitle>
          <p className="text-aura-gray-600">
            Enter your OpenAI API key to enable real-time AI analysis
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">OpenAI API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-aura-gray-600 bg-blue-50 p-3 rounded-lg">
              <p className="font-semibold mb-1">How to get an API key:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI API Keys</a></li>
                <li>Sign in or create an account</li>
                <li>Click "Create new secret key"</li>
                <li>Copy and paste it here</li>
              </ol>
            </div>
            
            <Button 
              type="submit" 
              className="w-full aura-gradient text-white"
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect OpenAI"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenAISetup;