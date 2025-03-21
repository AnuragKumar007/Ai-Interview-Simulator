import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper function to format improvement tips
const formatImprovementTips = (tips) => {
  if (!tips) return [];
  
  // Check if tips already contain numbered points (1., 2., etc.)
  if (tips.match(/\d+\.\s+\*\*[^*]+\*\*/)) {
    console.log("formatting");
    // Split by numbered points and filter empty entries
    const points = tips.split(/(\d+\.\s+)/)
      .filter(point => point.trim())
      .map(point => {
        // Clean up the point
        if (point.match(/^\d+\.\s+$/)) {
          // This is just a number prefix, skip it
          return null;
        }
        
        // Convert **Title:** format to bold HTML
        const formatted = point
          .replace(/\*\*([^*]+)\*\*/g, '<i>$1</i>')
          .trim();
          
        return formatted;
      })
      .filter(point => point !== null);
    
    return points;
  }
  
  // For tips without clear formatting, just return as a single item
  return [tips];
};

const Analytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  
  // Get interview data from location state
  const interviewData = location.state?.interviewData || null;
  const questions = location.state?.questions || [];
  const jobDescription = location.state?.jobDescription || location.state?.interviewData?.jobDescription || "Please provide a job description";
  
  // Fetch analysis from Gemini when component mounts
  useEffect(() => {
    // Check if we have interview data
    if (!interviewData) {
      setError("No interview data found. Please complete an interview first.");
      setLoading(false);
      return;
    }

    // Check if we have recordings
    if (!interviewData.recordings || interviewData.recordings.length === 0) {
      setError("No interview recordings found. Please complete the interview questions.");
      setLoading(false);
      return;
    }
    
    // Define async function to get analysis
    const getAnalysis = async () => {
      try {
        setLoading(true);
        
        // Make actual API call to backend
        const response = await axios.post('http://localhost:8080/api/services/analyzeInterview', {
          questions: interviewData.questions,
          recordings: interviewData.recordings,
          jobDescription: jobDescription
        });
        
        if (!response.data || !response.data.overallScore) {
          throw new Error('Invalid analysis response from server');
        }
        
        // Set the analysis data from the response
        setAnalysis(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to get analysis. Please try again later.');
        setLoading(false);
      }
    };
    
    getAnalysis();
  }, [interviewData, jobDescription]);
  
  // Return to home page
  const handleReturn = () => {
    navigate('/');
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Analyzing Your Responses</h1>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-lg text-gray-600">
              Our AI is analyzing your interview responses...<br/>
              This may take a minute.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Analysis Error</h1>
          <div className="bg-red-50 p-4 rounded-lg mb-6 text-red-800">
            <p>{error}</p>
          </div>
          <button 
            onClick={handleReturn}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Interview Analysis</h1>
        
        {/* Job Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{jobDescription}</p>
          </div>
        </div>
        
        {/* Overall Score */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Overall Performance</h2>
          <div className="flex items-center gap-4">
            <div className="h-32 w-32 rounded-full bg-blue-50 border-4 border-blue-500 flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-600">{analysis?.overallScore || 0}%</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-2">Strengths:</h3>
              <ul className="list-disc list-inside text-green-700 mb-4">
                {analysis?.strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
              
              <h3 className="font-medium text-lg mb-2">Areas for Improvement:</h3>
              <ul className="list-disc list-inside text-amber-700">
                {analysis?.weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Per Question Analysis */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Question by Question Analysis</h2>
          
          {analysis?.questionAnalysis.map((qa, index) => (
            <div key={index} className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <h3 className="font-medium"><strong>Question {qa.questionIndex + 1}</strong></h3>
                <p className="text-gray-700">{qa.question}</p>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium"><strong>Performance Score:</strong></span>
                  <span className={`px-3 py-1 rounded-full text-sm 
                    ${qa.score >= 90 ? 'bg-green-100 text-green-800' : 
                      qa.score >= 75 ? 'bg-blue-100 text-blue-800' : 
                      'bg-amber-100 text-amber-800'}`}
                  >
                    {qa.score}%
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="font-medium"><strong>Feedback:</strong></span>
                  <p className="text-gray-700">{qa.feedback}</p>
                </div>
                
                <div>
                  <span className="font-medium"><strong>Improvement Tips:</strong></span>
                  <div className="text-gray-700 mt-1">
                    {formatImprovementTips(qa.improvementTips).map((tip, i) => (
                      <div key={i} className="mb-2">
                        {i > 0 && <hr className="my-2 border-gray-200" />}
                        <div dangerouslySetInnerHTML={{ __html: tip }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between">
          <button 
            onClick={handleReturn}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
          
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Print Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;