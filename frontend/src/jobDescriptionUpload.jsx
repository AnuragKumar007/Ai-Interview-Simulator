import { useState } from 'react';
import axios from 'axios';

import './jobDescriptionUpload.css';

const JobDescriptionUpload = ({ setQuestions }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description!');
      return;
    }

    try {
      setUploadStatus('Submitting...');
      // Mock API call (replace with actual backend API)
      const response = await axios.post('/api/upload-job-description', {
        description: jobDescription,
      });
      setUploadStatus('Submission successful!');
      setQuestions(response.data.questions); // Set questions in parent component
    } catch (error) {
      setUploadStatus('Submission failed.');
      console.error('Error submitting job description:', error);
    }
    console.log(uploadStatus);
  };
  

  return (
    <div className="inputContainer p-6 pt-12 rounded-lg bg-[#FEF9E1] flex flex-col items-center justify-center">
      
      <input
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className={`inputField w-[50vh] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${jobDescription ? 'has-content' : ''}`}
        rows={2}
      />
      <label for="name" className="placeholder">Job Description</label>
      
      <button
        onClick={handleSubmit}
        // className="mt-0 px-4 py-1 bg-[#8B4513] text-white rounded-lg hover:bg-[#A0522D]"
        className="mt-2 px-6 py-2 bg-[#2C3E50] text-white rounded-lg hover:bg-[#16A085] transition-colors duration-300 shadow-md"
      >
        Submit
      </button>
      {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
    </div>
  );
};

export default JobDescriptionUpload;