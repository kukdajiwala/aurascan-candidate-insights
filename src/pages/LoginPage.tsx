
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brain, Mail, Lock, Camera, Mic, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'face' | 'voice'>('email');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Login Successful",
          description: "Welcome back to AURASCAN™",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Please check your credentials",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 1000);
  };

  const handleBiometricLogin = async (type: 'face' | 'voice') => {
    setLoading(true);
    
    try {
      if (type === 'face') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Simulate face detection
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          toast({
            title: "Face Recognition Successful",
            description: "Authenticated via facial recognition",
          });
          navigate('/dashboard');
          setLoading(false);
        }, 2000);
      } else if (type === 'voice') {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Simulate voice recognition
        setTimeout(() => {
          stream.getTracks().forEach(track => track.stop());
          toast({
            title: "Voice Recognition Successful",
            description: "Authenticated via voice recognition",
          });
          navigate('/dashboard');
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Biometric Authentication Failed",
        description: "Please allow camera/microphone access",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-aura-blue-600 hover:text-aura-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-aura-blue-600" />
            <span className="text-2xl font-bold text-aura-gray-900">AURASCAN™</span>
          </div>
          <h1 className="text-3xl font-bold text-aura-gray-900 mb-2">Welcome Back</h1>
          <p className="text-aura-gray-600">Sign in to your account</p>
        </div>

        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="text-center">Choose Login Method</CardTitle>
            <div className="flex justify-center space-x-2 mt-4">
              <Button
                variant={loginMethod === 'email' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLoginMethod('email')}
                className={loginMethod === 'email' ? 'aura-gradient text-white' : ''}
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button
                variant={loginMethod === 'face' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLoginMethod('face')}
                className={loginMethod === 'face' ? 'aura-gradient text-white' : ''}
              >
                <Camera className="h-4 w-4 mr-1" />
                Face
              </Button>
              <Button
                variant={loginMethod === 'voice' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLoginMethod('voice')}
                className={loginMethod === 'voice' ? 'aura-gradient text-white' : ''}
              >
                <Mic className="h-4 w-4 mr-1" />
                Voice
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {loginMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full aura-gradient text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>
            )}

            {loginMethod === 'face' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto border-4 border-dashed border-aura-blue-300 rounded-full flex items-center justify-center">
                  <Camera className="h-12 w-12 text-aura-blue-500" />
                </div>
                <p className="text-sm text-aura-gray-600">
                  Position your face in the camera frame for recognition
                </p>
                <Button 
                  onClick={() => handleBiometricLogin('face')}
                  className="w-full aura-gradient text-white"
                  disabled={loading}
                >
                  {loading ? 'Authenticating...' : 'Start Face Recognition'}
                </Button>
              </div>
            )}

            {loginMethod === 'voice' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto border-4 border-dashed border-aura-blue-300 rounded-full flex items-center justify-center">
                  <Mic className="h-12 w-12 text-aura-blue-500" />
                </div>
                <p className="text-sm text-aura-gray-600">
                  Speak clearly for voice recognition authentication
                </p>
                <Button 
                  onClick={() => handleBiometricLogin('voice')}
                  className="w-full aura-gradient text-white"
                  disabled={loading}
                >
                  {loading ? 'Listening...' : 'Start Voice Recognition'}
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-aura-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-aura-blue-600 hover:underline font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
