
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Shield, Zap, Users, BarChart3, Globe, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  
  const texts = [
    'Advanced AI-Powered HR Analytics',
    'Real-Time Candidate Assessment',
    'Enterprise-Grade Security',
    'Multilingual Interview Platform'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentText('');
    const text = texts[textIndex];
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index <= text.length) {
        setCurrentText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [textIndex, texts]);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze candidate behavior, personality, and potential with unprecedented accuracy.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with encrypted data transmission and secure storage of sensitive candidate information.'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Instant analysis and feedback during interviews with live sentiment and behavioral pattern detection.'
    },
    {
      icon: Users,
      title: 'Multi-Modal Assessment',
      description: 'Comprehensive evaluation using voice analysis, facial recognition, and document processing.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed reports with trust scores, risk assessments, and predictive career growth analysis.'
    },
    {
      icon: Globe,
      title: 'Global Platform',
      description: 'Multi-language support with real-time translation for international recruitment processes.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-aura-blue-50 via-white to-aura-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-effect border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-aura-blue-600" />
              <span className="text-2xl font-bold text-aura-gray-900">AURASCAN™</span>
            </div>
            <div className="flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-aura-gray-700 hover:text-aura-blue-600"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                className="aura-gradient text-white hover:opacity-90"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-slide-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-aura-gray-900 mb-6">
              Welcome to
              <span className="block aura-gradient bg-clip-text text-transparent">
                AURASCAN™
              </span>
            </h1>
            
            <div className="h-16 mb-8">
              <p className="text-xl sm:text-2xl text-aura-gray-600 font-medium">
                {currentText}
                <span className="animate-blink">|</span>
              </p>
            </div>

            <p className="text-lg text-aura-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your hiring process with cutting-edge AI technology. Analyze candidates in real-time, 
              predict performance, and make data-driven hiring decisions with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="aura-gradient text-white px-8 py-4 text-lg hover:opacity-90 animate-pulse-glow"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-aura-blue-300 text-aura-blue-600 hover:bg-aura-blue-50 px-8 py-4 text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-aura-gray-900 mb-4">
              Why Choose AURASCAN™?
            </h2>
            <p className="text-xl text-aura-gray-600 max-w-3xl mx-auto">
              Powered by advanced AI and machine learning, delivering insights that transform recruitment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-8 floating-card border-aura-blue-100 hover:border-aura-blue-300 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-16 h-16 aura-gradient rounded-xl mb-6 animate-float">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-aura-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-aura-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 aura-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-aura-blue-100 mb-8">
            Join leading enterprises worldwide in revolutionizing talent acquisition with AI.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="bg-white text-aura-blue-600 hover:bg-aura-blue-50 px-8 py-4 text-lg font-semibold"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-aura-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-aura-blue-400" />
            <span className="text-2xl font-bold">AURASCAN™</span>
          </div>
          <p className="text-aura-gray-400">
            Enterprise-grade AI recruitment platform. Transforming hiring since 2024.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
