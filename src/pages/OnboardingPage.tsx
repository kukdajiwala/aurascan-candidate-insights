
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Upload, Camera, Mic, FileText, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const checkMediaPermissions = async () => {
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }
      return true;
    } catch (error) {
      console.error('Media permissions check failed:', error);
      return false;
    }
  };

  const startCamera = async () => {
    try {
      setPermissionDenied(false);
      
      const hasPermissions = await checkMediaPermissions();
      if (!hasPermissions) {
        throw new Error('Media devices not supported in this browser');
      }

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraActive(true);
          toast({
            title: "Camera Started",
            description: "Camera is ready for photo capture"
          });
        };
      }
    } catch (error: any) {
      console.error('Camera access failed:', error);
      setPermissionDenied(true);
      setCameraActive(false);
      
      let errorMessage = "Please allow camera access and try again";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please allow camera access in your browser settings.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera found. Please connect a camera and try again.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage = "Camera not supported in this browser.";
      }

      toast({
        title: "Camera Access Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && cameraActive) {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (context && videoRef.current.videoWidth && videoRef.current.videoHeight) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], 'face-photo.jpg', { type: 'image/jpeg' });
              setFormData({...formData, facePhoto: file});
              
              // Stop camera after capture
              stopCamera();
              
              toast({
                title: "Photo Captured",
                description: "Face photo captured successfully"
              });
            }
          }, 'image/jpeg', 0.8);
        }
      } catch (error) {
        console.error('Photo capture failed:', error);
        toast({
          title: "Capture Failed",
          description: "Failed to capture photo. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startVoiceRecording = async () => {
    try {
      setPermissionDenied(false);
      setRecordingTime(0);

      const hasPermissions = await checkMediaPermissions();
      if (!hasPermissions) {
        throw new Error('Media devices not supported in this browser');
      }

      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        },
        video: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], 'voice-sample.webm', { type: 'audio/webm' });
        setFormData({...formData, voiceSample: file});
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        toast({
          title: "Voice Recorded",
          description: `Voice sample recorded successfully (${recordingTime}s)`
        });
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Auto stop after 10 seconds
      recordingTimeoutRef.current = setTimeout(() => {
        stopVoiceRecording();
      }, 10000);

      toast({
        title: "Recording Started",
        description: "Speak clearly for up to 10 seconds"
      });
      
    } catch (error: any) {
      console.error('Microphone access failed:', error);
      setPermissionDenied(true);
      setIsRecording(false);
      
      let errorMessage = "Please allow microphone access and try again";
      
      if (error.name === 'NotAllowedError') {
        errorMessage = "Microphone permission denied. Please allow microphone access in your browser settings.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No microphone found. Please connect a microphone and try again.";
      }

      toast({
        title: "Microphone Access Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'resume') => {
    const file = event.target.files?.[0];
    if (file) {
      if (fileType === 'resume' && file.type === 'application/pdf') {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: "File Too Large",
            description: "Please upload a PDF file smaller than 10MB",
            variant: "destructive"
          });
          return;
        }
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
            
            {!cameraActive && !formData.facePhoto ? (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto border-4 border-dashed border-aura-blue-300 rounded-full flex items-center justify-center mb-4">
                  <Camera className="h-12 w-12 text-aura-blue-500" />
                </div>
                
                {permissionDenied && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <p className="text-sm text-red-700">
                        Camera access required. Please allow camera permissions and try again.
                      </p>
                    </div>
                  </div>
                )}
                
                <Button onClick={startCamera} className="aura-gradient text-white">
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              </div>
            ) : cameraActive ? (
              <div className="text-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-64 h-48 mx-auto rounded-lg border-2 border-aura-blue-300 mb-4"
                />
                <div className="space-x-2">
                  <Button onClick={capturePhoto} className="aura-gradient text-white">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : null}
            
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
              <p className="text-aura-gray-600">Record a voice sample for analysis</p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 mx-auto border-4 border-dashed border-aura-blue-300 rounded-full flex items-center justify-center mb-4">
                <Mic className={`h-12 w-12 ${isRecording ? 'text-red-500 animate-pulse' : 'text-aura-blue-500'}`} />
              </div>
              
              {permissionDenied && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="text-sm text-red-700">
                      Microphone access required. Please allow microphone permissions and try again.
                    </p>
                  </div>
                </div>
              )}
              
              {!isRecording && !formData.voiceSample ? (
                <Button onClick={startVoiceRecording} className="aura-gradient text-white">
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              ) : isRecording ? (
                <div className="space-y-4">
                  <div className="text-lg font-medium text-red-600">
                    Recording... {recordingTime}s / 10s
                  </div>
                  <Button onClick={stopVoiceRecording} variant="destructive">
                    <Mic className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                  <p className="text-sm text-aura-gray-600">
                    Please speak clearly. Recording will auto-stop after 10 seconds.
                  </p>
                </div>
              ) : null}
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

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopCamera();
      stopVoiceRecording();
    };
  }, []);

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
