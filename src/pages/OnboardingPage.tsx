
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Upload, Camera, Mic, FileText, User, Mail, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    facePhoto: null as File | null,
    voiceSample: null as File | null,
    resume: null as File | null
  });
  const [isRecording, setIsRecording] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Access Failed",
        description: "Please allow camera access",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'face-photo.jpg', { type: 'image/jpeg' });
            setFormData({...formData, facePhoto: file});
            toast({
              title: "Photo Captured",
              description: "Face photo captured successfully"
            });
          }
        });
      }
      
      // Stop camera
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/mp3' });
        const file = new File([blob], 'voice-sample.mp3', { type: 'audio/mp3' });
        setFormData({...formData, voiceSample: file});
        toast({
          title: "Voice Recorded",
          description: "Voice sample captured successfully"
        });
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
          stream.getTracks().forEach(track => track.stop());
        }
      }, 10000);
      
    } catch (error) {
      toast({
        title: "Microphone Access Failed",
        description: "Please allow microphone access",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'resume') => {
    const file = event.target.files?.[0];
    if (file) {
      if (fileType === 'resume' && file.type === 'application/pdf') {
        setFormData({...formData, resume: file});
        toast({
          title: "Resume Uploaded",
          description: "PDF resume uploaded successfully"
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file for resume",
          variant: "destructive"
        });
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      toast({
        title: "Onboarding Complete",
        description: "Welcome to AURASCAN™! Redirecting to dashboard..."
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-aura-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Basic Information</h3>
              <p className="text-aura-gray-600">Let's start with your basic details</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Camera className="h-12 w-12 text-aura-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Face Photo Capture</h3>
              <p className="text-aura-gray-600">We'll capture your photo for analysis</p>
            </div>
            
            {!cameraActive ? (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto border-4 border-dashed border-aura-blue-300 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-12 w-12 text-aura-blue-500" />
                </div>
                <Button onClick={startCamera} className="aura-gradient text-white">
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-64 h-48 mx-auto rounded-lg border-2 border-aura-blue-300 mb-4"
                />
                <Button onClick={capturePhoto} className="aura-gradient text-white">
                  Capture Photo
                </Button>
              </div>
            )}
            
            {formData.facePhoto && (
              <div className="text-center text-green-600">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                Photo captured successfully!
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Mic className="h-12 w-12 text-aura-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Voice Sample</h3>
              <p className="text-aura-gray-600">Record a 10-second voice sample</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto border-4 border-dashed border-aura-blue-300 rounded-full flex items-center justify-center mb-4">
                <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-aura-blue-500'}`} />
              </div>
              
              {!isRecording ? (
                <Button onClick={startVoiceRecording} className="aura-gradient text-white">
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopVoiceRecording} variant="destructive">
                  Stop Recording
                </Button>
              )}
              
              {isRecording && (
                <p className="text-sm text-aura-gray-600 mt-2">
                  Recording... Please speak clearly
                </p>
              )}
            </div>
            
            {formData.voiceSample && (
              <div className="text-center text-green-600">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                Voice sample recorded successfully!
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 text-aura-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Upload Resume</h3>
              <p className="text-aura-gray-600">Upload your resume in PDF format</p>
            </div>
            
            <div className="border-2 border-dashed border-aura-blue-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-aura-blue-500 mx-auto mb-4" />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="hidden"
                id="resume-upload"
              />
              <Label htmlFor="resume-upload" className="cursor-pointer">
                <Button variant="outline" className="border-aura-blue-300 text-aura-blue-600">
                  Choose PDF File
                </Button>
              </Label>
              <p className="text-sm text-aura-gray-600 mt-2">
                PDF files only, max 10MB
              </p>
            </div>
            
            {formData.resume && (
              <div className="text-center text-green-600">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                Resume uploaded successfully: {formData.resume.name}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-aura-blue-600" />
            <span className="text-2xl font-bold text-aura-gray-900">AURASCAN™</span>
          </div>
          <h1 className="text-3xl font-bold text-aura-gray-900 mb-2">Candidate Onboarding</h1>
          <p className="text-aura-gray-600">Step {currentStep} of {totalSteps}</p>
          
          <div className="mt-4 max-w-md mx-auto">
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="floating-card">
          <CardContent className="p-8">
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                className="aura-gradient text-white"
                disabled={
                  (currentStep === 1 && (!formData.fullName || !formData.email)) ||
                  (currentStep === 2 && !formData.facePhoto) ||
                  (currentStep === 3 && !formData.voiceSample) ||
                  (currentStep === 4 && !formData.resume)
                }
              >
                {currentStep === totalSteps ? 'Complete Onboarding' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
