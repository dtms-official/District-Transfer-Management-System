import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import PerformanceTest from "./test/Test"; // Import performance test

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <PerformanceTest Component={App} /> */}
  </React.StrictMode>
);
