import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./_bootstrap.scss";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const rootElement = document.getElementById("root");
const initialStateElement = document.getElementById("initial-state");
const initialState = initialStateElement ? JSON.parse(initialStateElement.textContent) : {};
const app = (
  <React.StrictMode>
    <App initialState={initialState} />
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
