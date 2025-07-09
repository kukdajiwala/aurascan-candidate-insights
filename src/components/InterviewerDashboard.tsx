import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  Settings, 
  Download,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  expectedAnswer: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface InterviewerDashboardProps {
  onQuestionsUpdate?: (questions: Question[]) => void;
}

const InterviewerDashboard: React.FC<InterviewerDashboardProps> = ({ onQuestionsUpdate }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newExpectedAnswer, setNewExpectedAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const categories = ['General', 'Technical', 'Behavioral', 'Leadership', 'Problem Solving', 'Communication'];

  useEffect(() => {
    // Load saved questions
    const savedQuestions = localStorage.getItem('interviewer_questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    } else {
      // Default questions
      const defaultQuestions: Question[] = [
        {
          id: '1',
          question: 'Tell me about yourself and your professional background.',
          expectedAnswer: 'Clear, concise summary of experience, skills, and career goals.',
          category: 'General',
          difficulty: 'Easy'
        },
        {
          id: '2',
          question: 'Describe a challenging technical problem you solved recently.',
          expectedAnswer: 'Specific example with problem description, approach, and outcome.',
          category: 'Technical',
          difficulty: 'Hard'
        },
        {
          id: '3',
          question: 'How do you handle conflicts in a team environment?',
          expectedAnswer: 'Demonstrates conflict resolution skills and emotional intelligence.',
          category: 'Behavioral',
          difficulty: 'Medium'
        }
      ];
      setQuestions(defaultQuestions);
    }
  }, []);

  const addQuestion = () => {
    if (!newQuestion.trim() || !newExpectedAnswer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both question and expected answer",
        variant: "destructive"
      });
      return;
    }

    const newQuestionObj: Question = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      expectedAnswer: newExpectedAnswer.trim(),
      category: newCategory,
      difficulty: newDifficulty
    };

    const updatedQuestions = [...questions, newQuestionObj];
    setQuestions(updatedQuestions);
    setNewQuestion('');
    setNewExpectedAnswer('');
    
    toast({
      title: "Question Added",
      description: "New interview question has been added successfully"
    });
  };

  const deleteQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    
    toast({
      title: "Question Deleted",
      description: "Interview question has been removed"
    });
  };

  const saveQuestions = () => {
    localStorage.setItem('interviewer_questions', JSON.stringify(questions));
    if (onQuestionsUpdate) {
      onQuestionsUpdate(questions);
    }
    
    toast({
      title: "Questions Saved",
      description: "All interview questions have been saved successfully"
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Technical': 'bg-purple-100 text-purple-800',
      'Behavioral': 'bg-green-100 text-green-800',
      'Leadership': 'bg-orange-100 text-orange-800',
      'Problem Solving': 'bg-pink-100 text-pink-800',
      'Communication': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-aura-blue-600" />
              Interviewer Dashboard
            </div>
            <Button onClick={saveQuestions} className="aura-gradient text-white">
              <Save className="mr-2 h-4 w-4" />
              Save All Questions
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-aura-gray-600 mb-4">
            Manage interview questions and expected answers for AI comparison and analysis.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-aura-gray-50 rounded-lg">
            <div className="space-y-4">
              <div>
                <Label htmlFor="question">Interview Question</Label>
                <Textarea
                  id="question"
                  placeholder="Enter your interview question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="expectedAnswer">Expected Answer/Keywords</Label>
                <Textarea
                  id="expectedAnswer"
                  placeholder="What you expect in a good answer..."
                  value={newExpectedAnswer}
                  onChange={(e) => setNewExpectedAnswer(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={addQuestion}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="floating-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Interview Questions ({questions.length})</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Eye className="mr-2 h-4 w-4" />
                {isEditing ? 'View Mode' : 'Edit Mode'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4 hover:bg-aura-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-sm">
                        Q{index + 1}
                      </Badge>
                      <Badge className={getCategoryColor(question.category)}>
                        {question.category}
                      </Badge>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-aura-gray-900 mb-2">
                      {question.question}
                    </h4>
                    <div className="text-sm text-aura-gray-600 bg-blue-50 p-2 rounded">
                      <strong>Expected:</strong> {question.expectedAnswer}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {questions.length === 0 && (
              <div className="text-center py-8 text-aura-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No interview questions added yet.</p>
                <p className="text-sm">Add your first question above to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewerDashboard;