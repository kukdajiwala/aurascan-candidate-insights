import OpenAI from 'openai';

// Note: In production, this should be handled through a backend API
// For demo purposes, we'll use client-side integration
let openaiClient: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openaiClient = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Only for demo purposes
  });
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
}

export const analyzeCandidate = async (
  candidateData: {
    name: string;
    email: string;
    textResponse: string;
    voiceTranscription?: string;
  }
): Promise<AnalysisResult> => {
  if (!openaiClient) {
    throw new Error('OpenAI client not initialized. Please provide API key.');
  }

  const analysisInput = candidateData.voiceTranscription || candidateData.textResponse;
  
  const prompt = `
Analyze this job candidate's responses and provide a comprehensive psychological and professional assessment.

Candidate Information:
- Name: ${candidateData.name}
- Email: ${candidateData.email}
- Response: "${analysisInput}"

Based on their self-introduction and responses, analyze:
1. Emotional tone and confidence level
2. Trustworthiness indicators
3. Risk assessment for hiring
4. Personality traits and behavioral patterns
5. Communication effectiveness
6. Leadership potential
7. Technical aptitude signals
8. Stress handling capabilities

Provide a detailed JSON response with the following structure:
{
  "personalityScore": [0-100],
  "trustScore": [0-100], 
  "riskLevel": "Safe" | "Moderate" | "High",
  "loyaltyPrediction": [0-100],
  "consistencyScore": [0-100],
  "behaviorPrediction": "brief description",
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
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
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