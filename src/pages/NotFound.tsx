
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <Brain className="h-12 w-12 text-aura-blue-600" />
          <span className="text-3xl font-bold text-aura-gray-900">AURASCAN™</span>
        </div>
        
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-aura-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-aura-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-aura-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/')}
            className="w-full aura-gradient text-white"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full border-aura-blue-300 text-aura-blue-600"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
