
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Send, 
  ArrowLeft,
  Clock,
  Download,
  CheckCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const InterviewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const questions = [
    "Tell me about yourself and your professional background.",
    "What interests you most about this position?",
    "Describe a challenging project you've worked on recently.",
    "How do you handle stress and tight deadlines?",
    "Where do you see yourself in 5 years?",
    "What are your greatest strengths and weaknesses?",
    "Why should we hire you for this role?",
    "Do you have any questions for us?"
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted && !interviewCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted, interviewCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = async () => {
    try {
      // Start camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsVideoOn(true);
      }
      setInterviewStarted(true);
      toast({
        title: "Interview Started",
        description: "AI is now monitoring your responses"
      });
    } catch (error) {
      toast({
        title: "Camera/Microphone Error",
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast({
        title: "Recording Started",
        description: "Voice analysis is active"
      });
    } else {
      toast({
        title: "Recording Stopped",
        description: "Processing your response..."
      });
    }
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      toast({
        title: "No Answer Provided",
        description: "Please provide an answer before proceeding",
        variant: "destructive"
      });
      return;
    }

    // Simulate AI analysis
    toast({
      title: "Answer Analyzed",
      description: "AI has processed your response"
    });

    setUserAnswer('');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    setInterviewCompleted(true);
    setIsRecording(false);
    
    // Stop camera
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "Interview Completed",
      description: "Generating comprehensive analysis report..."
    });
  };

  if (interviewCompleted) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl floating-card">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-aura-gray-900 mb-4">
              Interview Completed Successfully!
            </h2>
            <p className="text-lg text-aura-gray-600 mb-6">
              Total Duration: {formatTime(timer)}
            </p>
            <p className="text-aura-gray-600 mb-8">
              Our AI has analyzed your responses and generated a comprehensive evaluation report.
            </p>
            
            <div className="space-y-4">
              <Button
                className="w-full aura-gradient text-white"
                onClick={() => navigate('/dashboard')}
              >
                <Download className="mr-2 h-5 w-5" />
                View Analysis Report
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/admin')}
              >
                Go to Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aura-blue-50 via-white to-aura-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-aura-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-aura-gray-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-aura-blue-600" />
                <span className="text-2xl font-bold text-aura-gray-900">AI Interview</span>
              </div>
            </div>
            
            {interviewStarted && (
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Clock className="mr-2 h-4 w-4" />
                  {formatTime(timer)}
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!interviewStarted ? (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="floating-card">
              <CardContent className="p-8">
                <Brain className="h-16 w-16 text-aura-blue-600 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-aura-gray-900 mb-4">
                  AI-Powered Interview Simulation
                </h1>
                <p className="text-lg text-aura-gray-600 mb-8">
                  Our advanced AI will conduct a comprehensive interview, analyzing your responses, 
                  body language, and voice patterns in real-time.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">What We Analyze:</h3>
                    <ul className="text-sm text-blue-700 space-y-1 text-left">
                      <li>• Voice tone and speech patterns</li>
                      <li>• Facial expressions and body language</li>
                      <li>• Response coherence and relevance</li>
                      <li>• Confidence and communication skills</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={startInterview}
                  className="aura-gradient text-white px-8 py-4 text-lg"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Start Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Feed */}
            <div className="lg:col-span-1">
              <Card className="floating-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Live Analysis</span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant={isVideoOn ? "default" : "outline"}
                        onClick={() => setIsVideoOn(!isVideoOn)}
                      >
                        {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={toggleRecording}
                      >
                        {isRecording ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-aura-gray-100 rounded-lg overflow-hidden mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level:</span>
                      <Badge className="bg-green-100 text-green-800">High</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Speech Clarity:</span>
                      <Badge className="bg-blue-100 text-blue-800">Excellent</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Engagement:</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interview Content */}
            <div className="lg:col-span-2">
              <Card className="floating-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-aura-blue-600" />
                    Interview Question {currentQuestion + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-aura-blue-50 to-white rounded-lg border border-aura-blue-200">
                    <h3 className="text-xl font-semibold text-aura-gray-900 mb-2">
                      AI Interviewer:
                    </h3>
                    <p className="text-lg text-aura-gray-700">
                      {questions[currentQuestion]}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-aura-gray-700">
                      Your Response:
                    </label>
                    <Textarea
                      placeholder="Type your answer here... or use voice recording"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={toggleRecording}
                        className={isRecording ? "text-red-600 border-red-300" : ""}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="mr-2 h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>

                    <Button
                      onClick={submitAnswer}
                      className="aura-gradient text-white"
                      disabled={!userAnswer.trim()}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {currentQuestion === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;
