// import React from "react";
// import ReactDOM from "react-dom/client";
// import { App } from "./App";
// import "./styles/index.css";
// // import "./styles/Roulette.css";
// import { BrowserRouter as Router } from "react-router-dom";

// const images = ["/images/back-blue.png", "/images/back.png"];

// images.forEach((src) => {
//   new Image().src = src;
// });

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <Router>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </Router>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "@/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>
);
