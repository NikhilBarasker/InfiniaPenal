import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, HashRouter } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";


ReactDOM.createRoot(document.getElementById("root")).render(
  // <BrowserRouter>
  <HashRouter>
     <>
      <App />
      <Toaster />
    </>
   </HashRouter>
  // {/* </BrowserRouter> */}
);
