import OpenAI from 'openai';

// Note: In production, use Supabase Edge Functions with secrets
// For demo purposes, we'll use client-side integration
let openaiClient: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  try {
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Only for demo purposes
    });
    return true;
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error);
    return false;
  }
};

// Get API key from localStorage or environment
export const getStoredAPIKey = (): string | null => {
  return localStorage.getItem('openai_api_key');
};

// Validate API key format
export const isValidAPIKey = (key: string): boolean => {
  return key.startsWith('sk-') && key.length > 20;
};

export interface AnalysisResult {
  personalityScore: number;
  trustScore: number;
  riskLevel: 'Safe' | 'Moderate' | 'High';
  loyaltyPrediction: number;
  consistencyScore: number;
  behaviorPrediction: string;
  mood: 'Happy' | 'Calm' | 'Nervous' | 'Aggressive';
  cognitiveMapping: string;
  careerGrowth: string;
  aiDetection: string;
  communicationSkills: number;
  technicalAptitude: number;
  leadershipPotential: number;
  stressHandling: number;
  confidenceLevel: number;
  emotionalStability: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  // Enhanced analysis fields
  voiceAnalysis: {
    tonality: string;
    speechClarity: number;
    emotionalStability: number;
    confidence: number;
    lyingIndicators: string[];
  };
  facialAnalysis: {
    attentiveness: number;
    genuineness: number;
    engagement: number;
    trustworthiness: number;
    microExpressions: string[];
  };
  resumeAnalysis?: {
    relevanceScore: number;
    experienceMatch: number;
    skillsAlignment: number;
    redFlags: string[];
    highlights: string[];
  };
  detailedInsights: {
    workStyle: string;
    teamFit: string;
    culturalAlignment: number;
    growthPotential: string;
    riskFactors: string[];
  };
}

// Analyze PDF content
export const analyzePDFContent = async (pdfText: string, type: 'resume' | 'coverLetter'): Promise<any> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized');
  }

  const prompt = `Analyze this ${type} and extract key information:

Content: "${pdfText}"

Provide analysis as JSON:
{
  "skills": ["skill1", "skill2"],
  "experience": "years of experience",
  "education": "education level",
  "redFlags": ["flag1", "flag2"],
  "strengths": ["strength1", "strength2"],
  "relevanceScore": 85,
  "professionalismScore": 90
}`;

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 500
  });

  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

// Analyze voice for emotional cues
export const analyzeVoiceEmotion = async (transcript: string): Promise<any> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized');
  }

  const prompt = `Analyze this speech transcript for emotional and behavioral cues:

Transcript: "${transcript}"

Provide analysis as JSON:
{
  "confidence": 85,
  "emotionalStability": 78,
  "stressIndicators": ["hesitation", "repetition"],
  "deceptionRisk": 15,
  "overallTone": "confident",
  "speechClarity": 92
}`;

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 300
  });

  return JSON.parse(response.choices[0]?.message?.content || '{}');
};

export const analyzeCandidate = async (
  candidateData: {
    name: string;
    email: string;
    textResponse: string;
    voiceTranscription?: string;
    resumeContent?: string;
    coverLetterContent?: string;
    interviewQuestions?: string[];
    expectedAnswers?: string[];
  }
): Promise<AnalysisResult> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Please provide API key.');
  }

  const analysisInput = candidateData.voiceTranscription || candidateData.textResponse;
  
  const resumeAnalysis = candidateData.resumeContent ? `\nResume Content: "${candidateData.resumeContent}"` : '';
  const coverLetterAnalysis = candidateData.coverLetterContent ? `\nCover Letter: "${candidateData.coverLetterContent}"` : '';
  const questionAnswerAnalysis = candidateData.interviewQuestions?.length ? 
    `\nInterview Questions & Answers:\n${candidateData.interviewQuestions.map((q, i) => `Q${i+1}: ${q}\nA${i+1}: ${candidateData.textResponse}`).join('\n')}` : '';

  const prompt = `
Analyze this job candidate comprehensively using advanced AI psychology and provide a detailed assessment for hiring decisions.

Candidate Information:
- Name: ${candidateData.name}
- Email: ${candidateData.email}
- Interview Responses: "${analysisInput}"${resumeAnalysis}${coverLetterAnalysis}${questionAnswerAnalysis}

COMPREHENSIVE ANALYSIS REQUIRED:
1. **Voice/Speech Analysis**: Analyze tone, confidence, speech patterns, emotional stability, and potential deception indicators
2. **Behavioral Psychology**: Deep personality assessment, trustworthiness, loyalty prediction, consistency patterns
3. **Professional Assessment**: Communication skills, technical aptitude, leadership potential, stress handling
4. **Risk Assessment**: Hiring risk level based on behavioral patterns and response consistency
5. **Cultural Fit**: Work style, team compatibility, organizational alignment
6. **Resume Analysis**: If provided, analyze experience relevance, skill alignment, and red flags
7. **Lie Detection**: Identify inconsistencies, evasive responses, or suspicious patterns

Provide a detailed JSON response with the following structure:
{
  "personalityScore": [0-100],
  "trustScore": [0-100], 
  "riskLevel": "Safe" | "Moderate" | "High",
  "loyaltyPrediction": [0-100],
  "consistencyScore": [0-100],
  "behaviorPrediction": "detailed behavioral prediction",
  "mood": "Happy" | "Calm" | "Nervous" | "Aggressive",
  "cognitiveMapping": "High" | "Medium" | "Low",
  "careerGrowth": "Excellent" | "Good" | "Average" | "Poor",
  "aiDetection": "Human" | "AI-Assisted" | "Suspicious",
  "communicationSkills": [0-100],
  "technicalAptitude": [0-100],
  "leadershipPotential": [0-100],
  "stressHandling": [0-100],
  "confidenceLevel": [0-100],
  "emotionalStability": [0-100],
  "strengths": ["detailed strength 1", "detailed strength 2", "detailed strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2", "specific weakness 3"],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"],
  "voiceAnalysis": {
    "tonality": "professional analysis of voice tone",
    "speechClarity": [0-100],
    "emotionalStability": [0-100],
    "confidence": [0-100],
    "lyingIndicators": ["indicator1", "indicator2"]
  },
  "facialAnalysis": {
    "attentiveness": [0-100],
    "genuineness": [0-100],
    "engagement": [0-100],
    "trustworthiness": [0-100],
    "microExpressions": ["expression1", "expression2"]
  },
  "resumeAnalysis": {
    "relevanceScore": [0-100],
    "experienceMatch": [0-100],
    "skillsAlignment": [0-100],
    "redFlags": ["flag1", "flag2"],
    "highlights": ["highlight1", "highlight2"]
  },
  "detailedInsights": {
    "workStyle": "detailed work style analysis",
    "teamFit": "team compatibility assessment",
    "culturalAlignment": [0-100],
    "growthPotential": "growth potential assessment",
    "riskFactors": ["risk1", "risk2"]
  }
}

Respond with ONLY the JSON object, no additional text.
`;

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert HR psychologist and candidate evaluator. Provide accurate, professional assessments based on candidate responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const analysisResult = JSON.parse(content) as AnalysisResult;
    return analysisResult;
    
  } catch (error) {
    console.error('OpenAI Analysis Error:', error);
    throw new Error('Failed to analyze candidate data');
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    // Convert blob to file
    const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });
    
    const response = await openaiClient.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en'
    });

    return response.text;
  } catch (error) {
    console.error('Audio transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};