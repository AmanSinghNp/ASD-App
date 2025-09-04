import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Checkout from "./Checkout.tsx"; //changed fromm App

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Checkout /> //changed fromm App
  </StrictMode>
);
