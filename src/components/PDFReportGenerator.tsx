import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText } from 'lucide-react';
import { AnalysisResult } from '@/lib/openai';

interface PDFReportGeneratorProps {
  candidateData: {
    name: string;
    email: string;
    analysis: AnalysisResult;
    submissionDate?: string;
  };
}

const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({ candidateData }) => {
  
  const generatePDFReport = () => {
    // Create HTML content for PDF conversion
    const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>AURASCAN Interview Report - ${candidateData.name}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header { 
          text-align: center; 
          border-bottom: 3px solid #3b82f6; 
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .header h1 { 
          color: #1e40af; 
          margin: 0;
          font-size: 2.5em;
        }
        .section { 
          margin-bottom: 25px; 
          padding: 15px;
          border-left: 4px solid #3b82f6;
          background: #f8fafc;
        }
        .score-box { 
          display: inline-block; 
          padding: 15px 25px; 
          margin: 10px; 
          background: #e0f2fe; 
          border-radius: 8px;
          text-align: center;
        }
        .score-value { 
          font-size: 2em; 
          font-weight: bold; 
          color: #1e40af; 
        }
        .risk-safe { color: #059669; }
        .risk-moderate { color: #d97706; }
        .risk-high { color: #dc2626; }
        .list-item { 
          padding: 8px 0; 
          border-bottom: 1px solid #e2e8f0; 
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 1px solid #e2e8f0;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧠 AURASCAN AI INTERVIEW REPORT</h1>
        <p>Advanced Candidate Assessment Platform</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>👤 Candidate Information</h2>
        <p><strong>Name:</strong> ${candidateData.name}</p>
        <p><strong>Email:</strong> ${candidateData.email}</p>
        <p><strong>Assessment Date:</strong> ${candidateData.submissionDate || new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>📊 Key Metrics</h2>
        <div style="text-align: center;">
          <div class="score-box">
            <div>Overall Score</div>
            <div class="score-value">${candidateData.analysis.personalityScore}%</div>
          </div>
          <div class="score-box">
            <div>Trust Score</div>
            <div class="score-value">${candidateData.analysis.trustScore}%</div>
          </div>
          <div class="score-box">
            <div>Risk Level</div>
            <div class="score-value risk-${candidateData.analysis.riskLevel?.toLowerCase()}">${candidateData.analysis.riskLevel}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>💪 Strengths</h2>
        ${candidateData.analysis.strengths?.map(strength => `<div class="list-item">• ${strength}</div>`).join('') || '<p>No strengths identified</p>'}
      </div>

      <div class="section">
        <h2>⚠️ Areas for Development</h2>
        ${candidateData.analysis.weaknesses?.map(weakness => `<div class="list-item">• ${weakness}</div>`).join('') || '<p>No weaknesses identified</p>'}
      </div>

      <div class="section">
        <h2>💡 AI Recommendations</h2>
        ${candidateData.analysis.recommendations?.map(rec => `<div class="list-item">• ${rec}</div>`).join('') || '<p>No recommendations available</p>'}
      </div>

      <div class="section">
        <h2>🎯 Detailed Analysis</h2>
        <p><strong>Communication Skills:</strong> ${candidateData.analysis.communicationSkills}%</p>
        <p><strong>Technical Aptitude:</strong> ${candidateData.analysis.technicalAptitude}%</p>
        <p><strong>Leadership Potential:</strong> ${candidateData.analysis.leadershipPotential}%</p>
        <p><strong>Stress Handling:</strong> ${candidateData.analysis.stressHandling}%</p>
        <p><strong>Emotional Stability:</strong> ${candidateData.analysis.emotionalStability}%</p>
        <p><strong>Confidence Level:</strong> ${candidateData.analysis.confidenceLevel}%</p>
      </div>

      <div class="section">
        <h2>🔍 Behavioral Insights</h2>
        <p><strong>Detected Mood:</strong> ${candidateData.analysis.mood}</p>
        <p><strong>Behavior Prediction:</strong> ${candidateData.analysis.behaviorPrediction}</p>
        <p><strong>Cognitive Mapping:</strong> ${candidateData.analysis.cognitiveMapping}</p>
        <p><strong>Career Growth Potential:</strong> ${candidateData.analysis.careerGrowth}</p>
        <p><strong>AI Detection Result:</strong> ${candidateData.analysis.aiDetection}</p>
      </div>

      <div class="footer">
        <p>🤖 Generated by AURASCAN AI Interview Platform</p>
        <p>This report is confidential and intended for authorized personnel only.</p>
        <p>Report ID: AUR-${Date.now()}</p>
      </div>
    </body>
    </html>
    `;

    // Create and download HTML file (can be opened and printed as PDF)
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AURASCAN_Report_${candidateData.name.replace(/\s+/g, '_')}_${new Date().getTime()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      onClick={generatePDFReport}
      className="aura-gradient text-white"
    >
      <Download className="mr-2 h-4 w-4" />
      Download Report
    </Button>
  );
};

export default PDFReportGenerator;