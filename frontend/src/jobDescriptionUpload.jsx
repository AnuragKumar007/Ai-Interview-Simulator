import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './jobDescriptionUpload.css';

const JobDescriptionUpload = ({ setQuestions }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    console.log('handleSubmit function called');
    if (!jobDescription.trim()) {
      alert('Please enter a job description!');
      return;
    }

    try {
      setUploadStatus('Submitting...');
      console.log('Making API call...');
      const response = await axios.post('http://localhost:8080/api/services/questionGenerator', {
        description: jobDescription,
      });
      
      console.log('API Response:', response.data);
      
      if (!response.data || !response.data.questions) {
        throw new Error('Invalid response format - missing questions');
      }
      // cursor changes
      // Process questions to ensure they are in the correct format
      let processedQuestions = response.data.questions;
      
      // If we received a single string that looks like JSON, try to parse it
      if (processedQuestions.length === 1 && 
          typeof processedQuestions[0] === 'string' && 
          processedQuestions[0].trim().startsWith('[') && 
          processedQuestions[0].trim().endsWith(']')) {
        try {
          const parsed = JSON.parse(processedQuestions[0]);
          if (Array.isArray(parsed)) {
            processedQuestions = parsed;
          }
        } catch (e) {
          console.error('Failed to parse question JSON:', e);
          // Keep the original if parsing fails
        }
      }
      //cursor changes end
      
      setUploadStatus('Submission successful!');
      console.log('About to navigate with questions:', processedQuestions);
      navigate('/questions', { state: { questions: processedQuestions } });
      console.log('Navigation called');
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setUploadStatus('Submission failed.');
      alert('Failed to generate questions. Please try again.');
    }
  };
  

  return (
    <div className="inputContainer p-6 pt-12 rounded-lg bg-[#FEF9E1] flex flex-col items-center justify-center">
      
      <input
        type="text"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className={`inputField w-[50vh] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${jobDescription ? 'has-content' : ''}`}
        rows={2}
      />
      <label htmlFor="name" className="placeholder">Job Description</label>
      
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-2 px-6 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#16A085] transition-colors duration-300 shadow-md"
      >
        Submit
      </button>
      {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
    </div>
  );
};

export default JobDescriptionUpload;