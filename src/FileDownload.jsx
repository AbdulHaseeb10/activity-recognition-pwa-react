// import { useState } from "react";

// function App() {
//   const [data, setData] = useState([]);
//   const [recording, setRecording] = useState(false);

//   const handleStartRecording = () => {
//     setRecording(true);
//     window.addEventListener("devicemotion", handleMotion);
//   };

//   const handleStopRecording = () => {
//     setRecording(false);
//     window.removeEventListener("devicemotion", handleMotion);
//     downloadData();
//   };

//   const handleMotion = (event) => {
//     const { accelerationIncludingGravity: { x, y, z } } = event;
//     setData((prevData) => [...prevData, { x, y, z }]);
//   };

//   const downloadData = () => {
//     const csvData = "x,y,z\n" + data.map(({ x, y, z }) => `${x},${y},${z}`).join("\n");
//     const element = document.createElement("a");
//     const file = new Blob([csvData], { type: "text/csv" });
//     element.href = URL.createObjectURL(file);
//     element.download = "activity1.csv";
//     document.body.appendChild(element);
//     element.click();
//     document.body.removeChild(element);
//   };

//   return (
    // <div>
    //   {recording ? (
    //     <button onClick={handleStopRecording}>Stop Recording</button>
    //   ) : (
    //     <button onClick={handleStartRecording}>Start Recording</button>
    //   )}
    // </div>
//   );
// }

// export default App;


import  { useState } from 'react';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [accelData, setAccelData] = useState([]);

  const handleStartRecording = () => {
    setIsRecording(true);
    window.addEventListener('devicemotion', handleAccelerometer);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    window.removeEventListener('devicemotion', handleAccelerometer);

    // Convert accelData to CSV string
    const csvData = "data:text/csv;charset=utf-8," 
      + "x,y,z\n" 
      + accelData.map(row => row.join(",")).join("\n");

    // Create a temporary <a> element to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvData));
    link.setAttribute("download", "activity1.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAccelerometer = (event) => {
    const { x, y, z } = event.acceleration;
    const newAccelData = [...accelData, [x, y, z]];
    setAccelData(newAccelData);
  };

  return (
    <div>
      {isRecording ? (
        <button onClick={handleStopRecording}>Stop Recording</button>
      ) : (
        <button onClick={handleStartRecording}>Start Recording</button>
      )}
    </div>
  );
}

export default App;

