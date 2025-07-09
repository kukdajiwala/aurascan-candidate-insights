import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Mic,
  MicOff,
  Send
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  expectedAnswer: string;
  category: string;
}

interface InterviewQAProps {
  onAnswersComplete?: (answers: Array<{questionId: string, answer: string, accuracy: number}>) => void;
}

const InterviewQA: React.FC<InterviewQAProps> = ({ onAnswersComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [answers, setAnswers] = useState<Array<{questionId: string, answer: string, accuracy: number}>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Array<{accuracy: number, feedback: string}>>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load questions from localStorage or use default
    const savedQuestions = localStorage.getItem('interviewer_questions');
    if (savedQuestions) {
      const parsed = JSON.parse(savedQuestions);
      setQuestions(parsed.slice(0, 5)); // Limit to 5 questions for interview
    } else {
      // Default questions
      setQuestions([
        {
          id: '1',
          question: 'Tell me about yourself and your professional background.',
          expectedAnswer: 'Clear summary of experience, skills, career goals with specific examples',
          category: 'General'
        },
        {
          id: '2',
          question: 'What interests you most about this position?',
          expectedAnswer: 'Specific reasons related to role, company, growth opportunities',
          category: 'Motivation'
        },
        {
          id: '3',
          question: 'Describe a challenging project you worked on recently.',
          expectedAnswer: 'Specific example with problem, approach, solution, and results',
          category: 'Experience'
        }
      ]);
    }
  }, []);

  const analyzeAnswer = async (answer: string, expectedAnswer: string): Promise<{accuracy: number, feedback: string, riskFlags: string[]}> => {
    // Simulate AI analysis - in real implementation, this would call OpenAI
    const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
    const feedback = accuracy > 85 ? 'Excellent response with good detail and relevance' :
                    accuracy > 75 ? 'Good response but could use more specific examples' :
                    'Response needs more detail and better alignment with expectations';
    
    const riskFlags = accuracy < 75 ? ['vague_response', 'lacks_specifics'] : [];
    
    return { accuracy, feedback, riskFlags };
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "No Answer Provided",
        description: "Please provide an answer before continuing",
        variant: "destructive"
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const analysis = await analyzeAnswer(currentAnswer, currentQuestion.expectedAnswer);
    
    const newAnswer = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      accuracy: analysis.accuracy
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setAnalysisResults([...analysisResults, analysis]);

    toast({
      title: "Answer Analyzed",
      description: `Accuracy: ${analysis.accuracy}% - ${analysis.feedback}`,
      variant: analysis.accuracy > 75 ? "default" : "destructive"
    });

    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer('');
    } else {
      // Interview complete
      if (onAnswersComplete) {
        onAnswersComplete(updatedAnswers);
      }
      toast({
        title: "Interview Questions Complete",
        description: "All questions have been answered and analyzed"
      });
    }
  };

  const startVoiceRecording = () => {
    // Voice recording implementation would go here
    setIsRecording(true);
    toast({
      title: "Voice Recording Started",
      description: "Speak your answer clearly"
    });
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // Simulate voice transcription
    setCurrentAnswer("This would be the transcribed voice response...");
    toast({
      title: "Voice Recording Complete",
      description: "Your response has been transcribed"
    });
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return 'text-green-600 bg-green-100';
    if (accuracy >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getAccuracyEmoji = (accuracy: number) => {
    if (accuracy >= 85) return '🎯';
    if (accuracy >= 75) return '👍';
    return '⚠️';
  };

  if (questions.length === 0) {
    return (
      <Card className="floating-card">
        <CardContent className="p-6 text-center">
          <MessageSquare className="h-12 w-12 text-aura-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-aura-gray-900 mb-2">No Questions Available</h3>
          <p className="text-aura-gray-600">Please add interview questions in the Admin panel first.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card className="floating-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Interview Progress</span>
            <span className="text-sm text-aura-gray-600">
              {currentQuestionIndex + 1} of {questions.length} questions
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-aura-blue-600" />
              Question {currentQuestionIndex + 1}
            </div>
            <Badge variant="outline">{currentQuestion.category}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-aura-blue-50 rounded-lg border-l-4 border-aura-blue-500">
            <p className="text-lg font-medium text-aura-gray-900">
              {currentQuestion.question}
            </p>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              rows={4}
              className="resize-none"
            />

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={isRecording ? 'text-red-600 border-red-300' : ''}
                >
                  {isRecording ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                  {isRecording ? 'Stop Recording' : 'Voice Answer'}
                </Button>
              </div>

              <Button
                onClick={submitAnswer}
                disabled={!currentAnswer.trim()}
                className="aura-gradient text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Interview'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Previous Answers Summary */}
      {answers.length > 0 && (
        <Card className="floating-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Answered Questions ({answers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {answers.map((answer, index) => {
                const analysis = analysisResults[index];
                return (
                  <div key={answer.questionId} className="flex items-center justify-between p-3 bg-aura-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getAccuracyEmoji(answer.accuracy)}</span>
                      <div>
                        <p className="font-medium text-aura-gray-900">Question {index + 1}</p>
                        <p className="text-sm text-aura-gray-600">{analysis?.feedback}</p>
                      </div>
                    </div>
                    <Badge className={getAccuracyColor(answer.accuracy)}>
                      {answer.accuracy}% Accuracy
                    </Badge>
                  </div>
                );
              })}
            </div>

            {answers.length === questions.length && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-800">Interview Complete!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Average Accuracy: {Math.round(answers.reduce((sum, a) => sum + a.accuracy, 0) / answers.length)}%
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewQA;