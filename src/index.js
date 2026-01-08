// import React ,{ useEffect } from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { createTheme,ThemeProvider } from '@mui/material/styles';
// import { useLocation , HashRouter} from "react-router-dom";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration"

// let theme = createTheme({
//     palette:{
//         primary :{
//             main:"#00040f",
//         },
//         secondary:{
//             main: "#F15C26",
//         },
//         white:{
//             main: "#fff",
//         },
//     },
// });
// ReactDOM.render(
// <ThemeProvider theme={theme}>
//  <HashRouter>
//  <App/>
//  </HashRouter>
//  </ThemeProvider>,
//  document.getElementById("root")
// );

// serviceWorkerRegistration.register();

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HashRouter } from "react-router-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00040f",
    },
    secondary: {
      main: "#F15C26",
    },
    white: {
      main: "#fff",
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <HashRouter>
      <App />
    </HashRouter>
  </ThemeProvider>,
  document.getElementById("root")
);

serviceWorkerRegistration.register();

