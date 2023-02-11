import { invoke } from "@tauri-apps/api";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GlobalContext } from "./context";
import { IConfig } from "./models/IConfig";
import "./style.css";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
