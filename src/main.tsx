import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";

const images = ["/images/back-blue.png", "/images/back.png"];

images.forEach((src) => {
  new Image().src = src;
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Router>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Router>
);
