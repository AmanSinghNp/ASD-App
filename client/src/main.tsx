import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProductCatalogue from './ProductCatalogue.tsx'; // product catalogue function
import Checkout from "./Checkout.tsx"; //Checkout function

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Checkout /> //changed fromm App
    <ProductCatalogue /> //render product catalouge
  </StrictMode>
);

