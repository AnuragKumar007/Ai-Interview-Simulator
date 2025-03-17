import { useState, useRef, useEffect } from "react";

const RecordingComponent = ({ questionIndex, onRecordingComplete, initialRecording }) => {
  // State variables to manage component behavior
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [countdown, setCountdown] = useState(null); // Countdown state: null = not counting, number = seconds remaining
  const [showRecordedVideo, setShowRecordedVideo] = useState(false); // Control whether to show recorded video
  const [stream, setStream] = useState(null); // New state to store the media stream
  
  // Refs to store media objects
  const mediaRecorder = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null); // Store stream reference to stop tracks later
  const countdownTimerRef = useRef(null); // Reference for the countdown timer

  // Effect to handle video stream when stream state changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
    }
  }, [stream]);

  // Reset component state when question changes
  useEffect(() => {
    // Reset recording state when question changes
    setRecording(false);
    setVideoURL(null);
    setCountdown(null);
    setShowRecordedVideo(false);
    setStream(null);
    
    // Display existing recording if available
    if (initialRecording && initialRecording.url) {
      setVideoURL(initialRecording.url);
      setShowRecordedVideo(true);
    }
    
    // Clean up media resources
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
  }, [questionIndex, initialRecording]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      // Stop any active media tracks when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clear any active countdown timer
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // Function to initiate countdown before recording
  const initiateCountdown = async () => {
    try {
      // Get camera & microphone access
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Store stream references
      streamRef.current = mediaStream;
      setStream(mediaStream); // This will trigger the useEffect to set up the video
      
      // Start countdown from 3
      setCountdown(3);
      
      // Set up countdown timer
      countdownTimerRef.current = setInterval(() => {
        setCountdown(prevCount => {
          // When countdown reaches 1, clear interval and start recording
          if (prevCount <= 1) {
            clearInterval(countdownTimerRef.current);
            startRecording(mediaStream);
            return null;
          }
          return prevCount - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setCountdown(null);
      // Show user-friendly error message
      alert("Could not access camera or microphone. Please ensure you have granted permission to use these devices.");
    }
  };

  // Function to start recording (called after countdown)
  const startRecording = (mediaStream) => {
    try {
      // Create a MediaRecorder instance
      mediaRecorder.current = new MediaRecorder(mediaStream);
      const chunks = [];

      // Collect recorded data
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      // Process the recorded data when recording stops
      mediaRecorder.current.onstop = () => {
        // Create a blob from recorded chunks
        const blob = new Blob(chunks, { type: "video/webm" });
        
        // Create URL for the recorded video
        const videoUrl = URL.createObjectURL(blob);
        setVideoURL(videoUrl);
        
        // Show the recorded video
        setShowRecordedVideo(true);
        
        // Notify parent component about the new recording
        if (onRecordingComplete) {
          onRecordingComplete(questionIndex, {
            blob,
            url: videoUrl,
            timestamp: new Date().toISOString()
          });
        }
      };

      // Request data every second and start recording
      mediaRecorder.current.start(1000);
      setRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Failed to start recording. Please try again.");
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    try {
      if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
        mediaRecorder.current.stop();
      }
      
      // Stop all media tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Reset video element and stream
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      
      // Update state
      setRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
      alert("Failed to stop recording. Please refresh the page and try again.");
    }
  };

  // Function to reset recording (discard current recording)
  const resetRecording = () => {
    setVideoURL(null);
    setShowRecordedVideo(false);
    // Notify parent component about recording reset
    if (onRecordingComplete) {
      onRecordingComplete(questionIndex, null);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Record Your Answer</h2>

      {/* Always render video element but control visibility with CSS */}
      <div className={`my-4 ${(!recording && !countdown && !stream) ? 'hidden' : ''}`}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline // Add playsInline for better mobile support
          muted 
          className="border rounded w-full max-w-md mx-auto"
        ></video>
      </div>

      {/* Countdown Display */}
      {countdown !== null && (
        <div className="flex justify-center items-center my-4">
          <div className="text-5xl font-bold text-blue-600 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
            {countdown}
          </div>
        </div>
      )}

      {/* Show Recorded Video */}
      {showRecordedVideo && videoURL && (
        <div className="my-4">
          <h3 className="font-semibold mb-2">Your Recorded Answer:</h3>
          <video 
            src={videoURL} 
            controls 
            playsInline
            className="border rounded w-full max-w-md mx-auto"
          ></video>
          <div className="mt-2 flex justify-center gap-2">
            <button 
              onClick={resetRecording} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Record Again
            </button>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      {!showRecordedVideo && (
        <div className="mt-4 flex justify-center">
          {!recording && countdown === null ? (
            <button 
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
              onClick={initiateCountdown}
            >
              Start Recording
            </button>
          ) : recording ? (
            <button 
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={stopRecording}
            >
              Stop Recording
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RecordingComponent;