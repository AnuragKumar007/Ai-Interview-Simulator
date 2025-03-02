import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RecordingComponent from './recordingComponent';

const Questions = () => {
  const location = useLocation();
  const questions = location.state?.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Technical Interview Questions</h1>
        
        {questions.length > 0 ? (
          <>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question card */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl text-gray-800 font-medium mb-4">
                {questions[currentIndex]}
              </h2>
              
              {/* Recording Component placeholder */}
              <div className="bg-gray-100 p-4 rounded-lg mb-4 text-center text-gray-500">
                <RecordingComponent/>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between gap-4">
              <button 
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200
                  ${currentIndex === 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                onClick={prevQuestion}
                disabled={currentIndex === 0}
              >
                ← Previous
              </button>

              <button 
                className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200
                  ${currentIndex === questions.length - 1 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={nextQuestion}
                disabled={currentIndex === questions.length - 1}
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No questions available. Please go back and submit a job description.
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
