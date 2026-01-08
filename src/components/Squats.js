import React, { useEffect, useState, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import angleBetweenThreePoints from "./angle";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import imgURL from "../assets/images/squat.gif";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import Cookies from "js-cookie";

let count = 0;
let dir = 0;

const speech = window.speechSynthesis;
const speak = (count) => {
  const object = new SpeechSynthesisUtterance(count);
  object.lang = "en-US";
  speech.speak(object);
};

const Squats = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const countTextbox = useRef(null);

  useEffect(() => {
    const startTime = new Date();
    const startTimeSec = startTime.getSeconds();
    localStorage.setItem("squatsStartTime", startTimeSec);
    console.log(startTime);
  }, []);

  function onResult(results) {
    if (results.poseLandmarks) {
      const position = results.poseLandmarks;
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const width = canvasRef.current.width;
      const height = canvasRef.current.height;

      const leftHand = [];
      const rightHand = [];
      const righthip = [];
      const lefthip = [];
      const hiparr = [11, 12, 23, 24, 25, 26];

      for (let i = 23; i < 29; i++) {
        let obj = {};
        obj["x"] = position[i].x * width;
        obj["y"] = position[i].y * height;
        if (i % 2 === 0) {
          rightHand.push(obj);
        } else {
          leftHand.push(obj);
        }
      }

      for (let i = 0; i < 6; i++) {
        let p = hiparr[i];
        let obj = {};
        obj["x"] = position[p].x * width;
        obj["y"] = position[p].y * height;
        if (p % 2 === 0) {
          righthip.push(obj);
        } else {
          lefthip.push(obj);
        }
      }

      const leftHandAngle = Math.round(angleBetweenThreePoints(leftHand));
      const rightHandAngle = Math.round(angleBetweenThreePoints(rightHand));
      const rightHipAngle = Math.round(angleBetweenThreePoints(righthip));
      const leftHipAngle = Math.round(angleBetweenThreePoints(lefthip));

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      let inRangeRightHand = rightHandAngle <= 20;
      let inRangeLeftHand = leftHandAngle <= 20;
      let inRangeRightHip = rightHipAngle >= 170 && rightHipAngle <= 180;
      let inRangeLeftHip = leftHipAngle >= 170 && leftHipAngle <= 180;

      for (let i = 0; i < 2; i++) {
        canvasCtx.beginPath();
        canvasCtx.lineWidth = 8;

        canvasCtx.moveTo(rightHand[i].x, rightHand[i].y);
        canvasCtx.lineTo(rightHand[i + 1].x, rightHand[i + 1].y);
        canvasCtx.strokeStyle = inRangeRightHand ? "green" : "red";
        canvasCtx.stroke();

        canvasCtx.beginPath();
        canvasCtx.moveTo(leftHand[i].x, leftHand[i].y);
        canvasCtx.lineTo(leftHand[i + 1].x, leftHand[i + 1].y);
        canvasCtx.strokeStyle = inRangeLeftHand ? "green" : "red";
        canvasCtx.stroke();

        canvasCtx.beginPath();
        canvasCtx.moveTo(righthip[i].x, righthip[i].y);
        canvasCtx.lineTo(righthip[i + 1].x, righthip[i + 1].y);
        canvasCtx.strokeStyle = inRangeRightHip ? "green" : "red";
        canvasCtx.stroke();

        canvasCtx.beginPath();
        canvasCtx.moveTo(lefthip[i].x, lefthip[i].y);
        canvasCtx.lineTo(lefthip[i + 1].x, lefthip[i + 1].y);
        canvasCtx.strokeStyle = inRangeLeftHip ? "green" : "red";
        canvasCtx.stroke();
      }

      for (let i = 0; i < 3; i++) {
        canvasCtx.beginPath();
        canvasCtx.arc(rightHand[i].x, rightHand[i].y, 8, 0, Math.PI * 2);
        canvasCtx.arc(leftHand[i].x, leftHand[i].y, 8, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#AAFF00";
        canvasCtx.fill();

        canvasCtx.beginPath();
        canvasCtx.arc(righthip[i].x, righthip[i].y, 8, 0, Math.PI * 2);
        canvasCtx.arc(lefthip[i].x, lefthip[i].y, 8, 0, Math.PI * 2);
        canvasCtx.fillStyle = "#AAFF00";
        canvasCtx.fill();
      }

      if (
        inRangeLeftHand &&
        inRangeRightHand &&
        inRangeRightHip &&
        inRangeLeftHip
      ) {
        if (dir === 0) {
          count++;
          speak(count);
          dir = 1;
          console.log(count);
        }
      }

      if (
        !(
          inRangeLeftHand &&
          inRangeRightHand &&
          inRangeRightHip &&
          inRangeLeftHip
        )
      ) {
        dir = 0;
      }

      canvasCtx.font = "30px aerial";
      canvasCtx.fillText(leftHandAngle, leftHand[1].x + 20, leftHand[1].y + 20);
      canvasCtx.fillText(rightHandAngle, rightHand[1].x - 120, rightHand[1].y + 20);
      canvasCtx.fillText(leftHipAngle, lefthip[1].x + 20, lefthip[1].y + 20);
      canvasCtx.fillText(leftHipAngle, lefthip[1].x - 120, lefthip[1].y + 20);

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
      minDetectionConfidence: 0.5,
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
        setCamera(cameraInstance);
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
    console.log("clicked");
    count = 0;
  }

  const handleClick = () => {
    const ID = Cookies.get("userID");
    if (!ID) {
      console.error("User ID is undefined. Please ensure the user is logged in.");
      return;
    }
    const docRef = doc(db, `user/${ID}/squats`, uuidv4());
    const startTimeStamp = localStorage.getItem("squatsStartTime");
    const endTimeVar = new Date();
    const endTimeStamp = endTimeVar.getSeconds();
    const timeSpent = endTimeStamp - startTimeStamp;
    const repsCounter = setDoc(docRef, {
      reps: count,
      startTimeStamp: startTimeStamp,
      endTimeStamp: endTimeStamp,
      timeSpent: Math.abs(timeSpent),
      uid: ID,
      exceriseName: "Squats",
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
          Squats
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
          <img src={imgURL} width="100%" alt="Squats" />
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
};

export default Squats;
