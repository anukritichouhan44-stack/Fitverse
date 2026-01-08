// import React from "react";
// import './App.css';
// import { Route, Routes,useNavigate} from "react-router-dom";
// import Home from "./pages/Home";
// import Yoga from "./pages/Yoga";

// import Landing from "./pages/landing.react";
// import Login from "./pages/Login.react";

// import Weightloss from "./pages/Weightloss.react";
// import Workout from "./pages/Workout.react";
// import { Container, Box} from "@mui/material";
// import logo from "./assets/images/logo-with-text2-removebg-preview.png";
// import BodyMeasurements from "./pages/BodyMeasurements.react";
// import Diet from "./pages/Diet.react";
// import Trikonasana from "./components/trikonasana";


// import BicepCurls from "./components/BicepCurls";
// import PushUps from "./components/PushUps";
// import Counter from "./components/counter";
// import Squats from "./components/Squats";



// function App() {
// const navigate = useNavigate();
// const location = window.location.pathname;
// if (location === "/yoga" && location === "/bicepcurl") {
//   const videoOutput = document.getElementsByClassName("input_video");
//   const canvas = document.getElementsByClassName("output_canvas");
//   videoOutput.style.display = "flex";
//   canvas.style.display = "flex";
// }
//   return (
//     <>
//     <Routes>
//       <Route path="*" element={<Landing />} exact />
//       <Route path="/" element={<Landing />} exact />
//       <Route path="/login" element={<Login />} exact />
//       <Route path ="/bm" element ={ <BodyMeasurements />} exact/>
//       <Route path ="/home" element ={ <Home />} exact/>
//       <Route path ="/Diet" element ={ <Diet />} exact/>
//       <Route path ="/yoga" element ={ <Yoga />} exact/>
//       <Route path ="/weightloss" element ={ <Weightloss />} exact/>
//       <Route path ="/bicepcurls" element ={ <BicepCurls />} exact/>
//       <Route path ="/squats" element ={ <Squats />} exact/>
//       <Route path ="/pushups" element ={ <PushUps />} exact/>
//       <Route path ="/workout" element ={ <Workout />} exact/>

     
//       <Route
//        path ="/crunches"
//       element ={ <Counter  exercise={"crunches"} />} 
//       exact
//       />
//       <Route path="/trikonasana" element={<Trikonasana />} />

//     </Routes>
//     {/* footer */}
//     <Container
//         maxWidth="false"
//         sx={{
//           display: "flex",
//           justifyContent: {
//             lg: "space-between",
//             sm: "space-between",
//             xs: "center",
//           },
//           alignItems: "center",
//           height: "100%",
//           width: "100%",
//           flexDirection: { lg: "row", sm: "row", xs: "column" },
//           color: "#fff",
//           gap: { lg: "2rem", xs: "1rem" },
//         }}
//       >
//          <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//             marginTop: { lg: 0, xs: "1rem" },
//           }}
//         >
//           <img src={logo} alt="logo" width="40%" />
//         </Box>
//       </Container>

  
    
//     </>
//   );
// }

// export default App;

import React, { useEffect } from "react";
import './App.css';
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Yoga from "./pages/Yoga";
import Landing from "./pages/landing.react";
import Login from "./pages/Login.react";
import Weightloss from "./pages/Weightloss.react";
import Workout from "./pages/Workout.react";
import BodyMeasurements from "./pages/BodyMeasurements.react";
import Diet from "./pages/Diet.react";
import Trikonasana from "./components/trikonasana";
import BicepCurls from "./components/BicepCurls";
import PushUps from "./components/PushUps";
import Counter from "./components/counter";
import Squats from "./components/Squats";

import { Container, Box } from "@mui/material";
import logo from "./assets/images/logo-with-text2-removebg-preview.png";

function App() {
  const location = useLocation();

  // useEffect(() => {
  //   // Conditionally show video and canvas elements on certain routes
  //   const showCanvasRoutes = ["/yoga", "/bicepcurls"];
  //   if (showCanvasRoutes.includes(location.pathname)) {
  //     const videoOutput = document.querySelector(".input_video");
  //     const canvas = document.querySelector(".output_canvas");
  //     if (videoOutput && canvas) {
  //       videoOutput.style.display = "flex";
  //       canvas.style.display = "flex";
  //     }
  //   
  // }, [location]);

  useEffect(() => {
    const showCanvasRoutes = ["/yoga", "/bicepcurls"];
    const videoOutput = document.querySelector(".input_video");
    const canvas = document.querySelector(".output_canvas");
  
    if (videoOutput && canvas) {
      const shouldShow = showCanvasRoutes.includes(location.pathname);
      videoOutput.style.display = shouldShow ? "flex" : "none";
      canvas.style.display = shouldShow ? "flex" : "none";
    }
  }, [location]);
  

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bm" element={<BodyMeasurements />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Diet" element={<Diet />} />
        <Route path="/yoga" element={<Yoga />} />
        <Route path="/weightloss" element={<Weightloss />} />
        <Route path="/bicepcurls" element={<BicepCurls />} />
        <Route path="/squats" element={<Squats />} />
        <Route path="/pushups" element={<PushUps />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/crunches" element={<Counter exercise="crunches" />} />
        <Route path="/trikonasana" element={<Trikonasana />} />
        <Route path="*" element={<Landing />} />
      </Routes>

      {/* Footer */}
      <Container
        maxWidth="false"
        sx={{
          display: "flex",
          justifyContent: {
            lg: "space-between",
            sm: "space-between",
            xs: "center",
          },
          alignItems: "center",
          height: "100%",
          width: "100%",
          flexDirection: { lg: "row", sm: "row", xs: "column" },
          color: "#fff",
          gap: { lg: "2rem", xs: "1rem" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: { lg: 0, xs: "1rem" },
          }}
        >
          <img src={logo} alt="logo" width="40%" />
        </Box>
      </Container>
    </>
  );
}

export default App;

