// import { useState, useEffect } from "react";
// import * as tf from "@tensorflow/tfjs";

// const modelJSON = "https://keras.onrender.com/model.json";
// const modelWeights = "https://keras.onrender.com/group1-shard1of1.bin";

// const ActivityClassifier = () => {
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [outputValues, setOutputValues] = useState(null);
//   let model;
//   const loadModel = async () => {
//     try {
//       const response = await fetch(`${modelJSON}`);
//       const modelTopology = await response.json();
//       const weightsManifest = [
//         {
//           paths: [`${modelWeights}`],
//           weights: null,
//         },
//       ];
//       model = await tf.loadLayersModel(
//         tf.io.fromMemory(modelTopology, weightsManifest)
//       );
//       console.log("Model loaded successfully");
//       setModelLoaded(true);

//       // call predict on the loaded model
//       let inputValues = [];
//       for (let i = 0; i < 80; i++) {
//         let arr = [];
//         for (let j = 0; j < 3; j++) {
//           arr.push(Math.random() * 2 - 1);
//         }
//         inputValues.push(arr);
//       }
//       inputValues = [inputValues];
//       const inputTensor = tf.tensor(inputValues, [1, 80, 3, 1]);
//       const outputTensor = model.predict(inputTensor);
//       const outputValues = outputTensor.arraySync();
//       setOutputValues(outputValues);

//       console.log(outputValues);
//     } catch (err) {
//       console.log("Error loading the model:", err);
//       // handle the error
//     }
//   };

//   useEffect(() => {
//     loadModel();
//   }, []);

//   return (
//     <div>
//       {modelLoaded ? (
//         <div>
//           Activity Classifier
//           {outputValues &&
//             outputValues[0].map((val, i) => {
//               return (
//                 <>
//                   <div key={i}>{val}</div>
//                   <br />
//                 </>
//               );
//             })}
//         </div>
//       ) : (
//         <div>Loading model...</div>
//       )}
//     </div>
//   );
// };

// export default ActivityClassifier;

import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
const modelJSON = "https://keras.onrender.com/model.json";
const modelWeights = "https://keras.onrender.com/group1-shard1of1.bin";
let model;

const loadModel = async () => {
  try {
    const response = await fetch(`${modelJSON}`);
    const modelTopology = await response.json();
    const weightsManifest = [
      {
        paths: [`${modelWeights}`],
        weights: null,
      },
    ];
    model = await tf.loadLayersModel(
      tf.io.fromMemory(modelTopology, weightsManifest)
    );
    console.log("Model loaded successfully");
  } catch (err) {
    console.log("Error loading the model:", err);
    // handle the error
  }
};
loadModel();
const ActivityClassifier = () => {
  let arr = [];
  let vals = [];
  const [acceleration, setAcceleration] = useState({
    x: null,
    y: null,
    z: null,
  });
  const [outputValues, setOutputValues] = useState(null);
  useEffect(() => {
    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  const getPredictions = (data) => {
    const valuedArr = [data];
    const inputTensor = tf.tensor(valuedArr, [1, 80, 3, 1]);
    const outputTensor = model.predict(inputTensor);
    const outputValues = outputTensor.arraySync();
    setOutputValues(outputValues);
  };

  const handleMotion = (event) => {
    const { x, y, z } = event.acceleration;
    arr.push(x);
    arr.push(y);
    arr.push(z);
    vals.push(arr);
    arr = [];
    if (vals.length === 80) {
      getPredictions(vals);
      vals = [];
    }
    setAcceleration({ x, y, z });
  };

  const activities = [
    "Walking",
    "Jogging",
    "Upstairs",
    "Downstairs",
    "Sitting",
    "Standing",
  ];

  return (
    <div>
      <h1>Human Activity Recognition</h1>
      {console.log("outputValues", outputValues)}
      {outputValues &&
        outputValues.map((item) => {
          return (
            <>
              {item.map((value, i) => {
                return (
                  activities[i] !== "Upstairs" &&
                  activities[i] !== "Downstairs" && (
                    <div key={i}>
                      {activities[i]}:{value.toFixed(2)*100}%
                    </div>
                  )
                );
              })}
            </>
          );
        })}
    </div>
  );
};

export default ActivityClassifier;
