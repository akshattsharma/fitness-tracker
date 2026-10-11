import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SnackbarProvider maxSnack={3} autoHideDuration={2500} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
    <App />
  </SnackbarProvider>
);