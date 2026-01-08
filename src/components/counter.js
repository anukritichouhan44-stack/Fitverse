import React, { useState, useEffect, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import angleBetweenThreePoints from "./angle";
import Button from "@mui/material/Button";
import imgURL from "../assets/images/Crunch.gif";
import { Link } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import Cookies from "js-cookie";

const exrInfo = {
  crunches: {
    index: [12, 24, 26],
    ul: 130,
    ll: 50,
  },
};

let count = 0;
let dir = 0;
let angle = 0;

const speech = window.speechSynthesis;
const speak = (count) => {
  const object = new SpeechSynthesisUtterance(count);
  object.lang = "en-US";
  speech.speak(object);
};

function Counter(props) {
  useEffect(() => {
    const startTime = new Date();
    const startTimeSec = startTime.getSeconds();
    localStorage.setItem("crunchesStartTime", startTimeSec);
    console.log(startTime);
  }, []);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const countTextbox = useRef(null);

  function onResult(results) {
    if (results.poseLandmarks) {
      const position = results.poseLandmarks;
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      const upadatedPos = [];
      const indexArray = exrInfo[props.exercise].index;

      for (let i = 0; i < 3; i += 1) {
        upadatedPos.push({
          x: position[indexArray[i]].x * width,
          y: position[indexArray[i]].y * height,
        });
      }

      angle = Math.round(angleBetweenThreePoints(upadatedPos));

      if (angle > exrInfo[props.exercise].ul) {
        if (dir === 0) {
          dir = 1;
        }
      }
      if (angle < exrInfo[props.exercise].ll) {
        if (dir === 1) {
          count++;
          speak(count);
          dir = 0;
        }
      }

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      for (let i = 0; i < 2; i++) {
        canvasCtx.beginPath();
        canvasCtx.moveTo(upadatedPos[i].x, upadatedPos[i].y);
        canvasCtx.lineTo(upadatedPos[i + 1].x, upadatedPos[i + 1].y);
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "white";
        canvasCtx.stroke();
      }
      for (let i = 0; i < 3; i++) {
        canvasCtx.beginPath();
        canvasCtx.arc(upadatedPos[i].x, upadatedPos[i].y, 10, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#AAFF00";
        canvasCtx.fill();
      }
      canvasCtx.font = "40px aerial";
      canvasCtx.fillText(angle, upadatedPos[1].x + 10, upadatedPos[1].y + 40);
      canvasCtx.restore();
    }
  }

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1633558788/${file}`;
      },
    });
    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResult);

    let cameraInstance = null;
    const startCamera = async () => {
      if (webcamRef.current && webcamRef.current.video) {
        cameraInstance = new cam.Camera(webcamRef.current.video, {
          onFrame: async () => {
            if (webcamRef.current && webcamRef.current.video) {
              if (countTextbox.current) {
                countTextbox.current.value = count;
              } else {
                console.warn("countTextbox is not yet available");
              }
              await pose.send({ image: webcamRef.current.video });
            } else {
              console.error(
                "webcamRef or its video property is null within onFrame. Stopping camera."
              );
              if (cameraInstance) {
                cameraInstance.stop();
              }
            }
          },
          width: 640,
          height: 480,
        });
        cameraInstance.start();
      } else {
        console.error(
          "webcamRef or its video property is null. Camera initialization failed."
        );
      }
    };
    startCamera();

    return () => {
      if (cameraInstance && cameraInstance.stop) {
        cameraInstance.stop();
      }
    };
  }, []);

  function resetCount() {
    count = 0;
    dir = 0;
  }

  const handleClick = () => {
    const ID = Cookies.get("userID");
    if (!ID) {
      console.error("User ID is undefined. Please ensure the user is logged in.");
      return;
    }
    const docRef = doc(db, `user/${ID}/crunches`, uuidv4());
    const startTimeStamp = localStorage.getItem("crunchesStartTime");
    const endTimeVar = new Date();
    const endTimeStamp = endTimeVar.getSeconds();
    const timeSpent = endTimeStamp - startTimeStamp;
    const repsCounter = setDoc(docRef, {
      reps: count,
      startTimeStamp: startTimeStamp,
      endTimeStamp: endTimeStamp,
      timeSpent: Math.abs(timeSpent),
      exceriseName: "Crunches",
      uid: ID,
    });
    console.log(repsCounter);
  };

  return (
    <Container
      maxWidth="100%"
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: "2rem",
        flexDirection: { lg: "row", xs: "column" },
        gap: "2rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          position: "relative",
          borderRadius: "2rem",
          width: "100%",
        }}
      >
        <Webcam ref={webcamRef} className="full-width" />
        <canvas
          ref={canvasRef}
          className="full-width"
          style={{ position: "absolute" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          borderRadius: "2rem",
          width: { lg: "40%", xs: "100%" },
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          style={{ textTransform: "capitalize" }}
        >
          Crunches
        </Typography>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={imgURL} width="100%" alt="Crunches" />
        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            padding: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              padding: "1rem",
            }}
          >
            <Typography variant="h6" color="secondary">
              Count
            </Typography>
            <input
              variant="filled"
              ref={countTextbox}
              value={count}
              textAlign="center"
              style={{
                height: 50,
                fontSize: 20,
                width: 80,
                padding: "1rem",
                border: "2px solid orange",
                borderRadius: "10px",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
              borderRadius: "2rem",
            }}
          >
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={resetCount}
            >
              Reset Counter
            </Button>
            <Link
              to="/workout"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Button
                size="large"
                variant="contained"
                color="primary"
                sx={{ cursor: "pointer" }}
                onClick={handleClick}
              >
                back
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Counter;
