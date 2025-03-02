import { useState, useRef } from "react";

const RecordingComponent=() => {
    const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const mediaRecorder = useRef(null);
  const videoRef = useRef(null);

  // Function to start recording
  const startRecording = async () => {
    try {
      // Get camera & microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      videoRef.current.srcObject = stream;

      // Create a MediaRecorder instance
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks = [];

      // Collect recorded data
      mediaRecorder.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      // Process the recorded data when recording stops
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setVideoURL(URL.createObjectURL(blob));
      };

      // Start recording
      mediaRecorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    mediaRecorder.current.stop();
    setRecording(false);
    videoRef.current.srcObject = null;
    // videoRef.current.src = ""; work same as above line
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold">Record Your Answer</h2>

      {/* Video Preview */}
      {/* <video ref={videoRef} autoPlay className="border rounded w-full max-w-md"></video> */}
      {videoRef && <video ref={videoRef} autoPlay className="border rounded w-full max-w-md"></video>}

      {/* Start / Stop Buttons */}
      <div className="mt-2">
        {!recording ? (
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={startRecording}>
            Start Recording
          </button>
        ) : (
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={stopRecording}>
            Stop Recording
          </button>
        )}
      </div>

      {/* Show Recorded Video */}
      {/* {videoURL && (
        <div className="mt-4">
          <h3 className="font-semibold">Recorded Video:</h3>
          <video src={videoURL} controls className="border rounded w-full max-w-md"></video>
        </div>
      )} */}
    </div>
  );
};
export default RecordingComponent;