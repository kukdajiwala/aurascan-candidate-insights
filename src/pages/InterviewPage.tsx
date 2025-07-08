import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  CheckCircle,
  User,
  Mail,
  Loader2
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { analyzeCandidate, transcribeAudio, AnalysisResult, initializeOpenAI } from '@/lib/openai';
import OpenAISetup from '@/components/OpenAISetup';

const InterviewPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Setup states
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  
  // Candidate info states  
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [infoCollected, setInfoCollected] = useState(false);
  
  // Interview states
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // Audio recording states
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [allResponses, setAllResponses] = useState<string[]>([]);
  
  // Analysis states
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  // Check for existing API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      initializeOpenAI(savedKey);
      setIsSetupComplete(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interviewStarted && !interviewCompleted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interviewStarted, interviewCompleted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const collectCandidateInfo = () => {
    if (!candidateName.trim() || !candidateEmail.trim()) {
      toast({
        title: "Information Required",
        description: "Please enter your name and email",
        variant: "destructive"
      });
      return;
    }
    setInfoCollected(true);
  };

  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsVideoOn(true);
      }
      
      setInterviewStarted(true);
      toast({
        title: "Interview Started",
        description: "AI analysis is now active"
      });
    } catch (error) {
      toast({
        title: "Media Access Error", 
        description: "Please allow camera and microphone access",
        variant: "destructive"
      });
    }
  };

  const startAudioRecording = async () => {
    try {
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      setAudioChunks([]);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak your answer clearly"
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Failed to start audio recording",
        variant: "destructive"
      });
    }
  };

  const stopAudioRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      return new Promise<void>((resolve) => {
        mediaRecorderRef.current!.onstop = async () => {
          try {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const transcription = await transcribeAudio(audioBlob);
            setUserAnswer(transcription);
            
            toast({
              title: "Transcription Complete",
              description: "Your voice has been converted to text"
            });
          } catch (error) {
            toast({
              title: "Transcription Failed", 
              description: "Please type your answer instead",
              variant: "destructive"
            });
          }
          resolve();
        };
        
        mediaRecorderRef.current!.stop();
        setIsRecording(false);
      });
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopAudioRecording();
    } else {
      await startAudioRecording();
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

    // Store the response
    setAllResponses(prev => [...prev, userAnswer.trim()]);
    setUserAnswer('');
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      toast({
        title: "Answer Recorded",
        description: "Moving to next question"
      });
    } else {
      completeInterview();
    }
  };

  const completeInterview = async () => {
    setInterviewCompleted(true);
    setIsRecording(false);
    setIsAnalyzing(true);
    
    // Stop all media streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    try {
      // Combine all responses for analysis
      const combinedResponses = allResponses.join(' ');
      
      const analysis = await analyzeCandidate({
        name: candidateName,
        email: candidateEmail,
        textResponse: combinedResponses,
        voiceTranscription: combinedResponses
      });
      
      setAnalysisResult(analysis);
      
      // Store analysis result in localStorage for dashboard
      localStorage.setItem('latest_analysis', JSON.stringify(analysis));
      localStorage.setItem('candidate_info', JSON.stringify({
        name: candidateName,
        email: candidateEmail
      }));
      
      toast({
        title: "Analysis Complete",
        description: "Your interview has been successfully analyzed"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze responses. Please check your OpenAI setup.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Show OpenAI setup if not configured
  if (!isSetupComplete) {
    return <OpenAISetup onSetupComplete={() => setIsSetupComplete(true)} />;
  }

  // Show completion screen
  if (interviewCompleted) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl floating-card">
          <CardContent className="p-8 text-center">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-16 w-16 text-aura-blue-600 mx-auto mb-6 animate-spin" />
                <h2 className="text-3xl font-bold text-aura-gray-900 mb-4">
                  Analyzing Your Responses...
                </h2>
                <p className="text-lg text-aura-gray-600 mb-6">
                  Our AI is processing your interview data and generating insights.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-aura-gray-900 mb-4">
                  Interview Completed Successfully!
                </h2>
                <p className="text-lg text-aura-gray-600 mb-6">
                  Total Duration: {formatTime(timer)}
                </p>
                <p className="text-aura-gray-600 mb-8">
                  Your responses have been analyzed by our AI system and a comprehensive evaluation report has been generated.
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
              </>
            )}
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
        {/* Candidate Info Collection */}
        {!infoCollected ? (
          <div className="max-w-2xl mx-auto">
            <Card className="floating-card">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <User className="h-12 w-12 text-aura-blue-600 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-aura-gray-900 mb-4">
                    Candidate Information
                  </h1>
                  <p className="text-lg text-aura-gray-600">
                    Please provide your basic information before starting the AI-powered interview.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={collectCandidateInfo}
                  className="w-full mt-6 aura-gradient text-white"
                  disabled={!candidateName.trim() || !candidateEmail.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Continue to Interview
                </Button>
              </CardContent>
            </Card>
          </div>

        /* Interview Prep Screen */
        ) : !interviewStarted ? (
          <div className="max-w-2xl mx-auto text-center">
            <Card className="floating-card">
              <CardContent className="p-8">
                <Brain className="h-16 w-16 text-aura-blue-600 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-aura-gray-900 mb-4">
                  AI-Powered Interview Simulation
                </h1>
                <p className="text-lg text-aura-gray-600 mb-8">
                  Welcome {candidateName}! Our advanced AI will conduct a comprehensive interview, 
                  analyzing your responses, voice patterns, and communication style in real-time.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">What We Analyze:</h3>
                    <ul className="text-sm text-blue-700 space-y-1 text-left">
                      <li>• Voice tone and speech patterns</li>
                      <li>• Response coherence and relevance</li>
                      <li>• Confidence and communication skills</li>
                      <li>• Personality traits and behavioral patterns</li>
                      <li>• Trust indicators and risk assessment</li>
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={startInterview}
                  className="aura-gradient text-white px-8 py-4 text-lg"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Start AI Interview
                </Button>
              </CardContent>
            </Card>
          </div>

        /* Active Interview */
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Feed & Analysis */}
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
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-aura-gray-100 rounded-lg overflow-hidden mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Status:</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Responses:</span>
                      <Badge className="bg-blue-100 text-blue-800">{allResponses.length}/{questions.length}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Recording:</span>
                      <Badge className={isRecording ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                        {isRecording ? "Active" : "Standby"}
                      </Badge>
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
                      placeholder="Type your answer here or use voice recording..."
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
                        disabled={isAnalyzing}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="mr-2 h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-4 w-4" />
                            Record Answer
                          </>
                        )}
                      </Button>
                    </div>

                    <Button
                      onClick={submitAnswer}
                      className="aura-gradient text-white"
                      disabled={!userAnswer.trim() || isAnalyzing}
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