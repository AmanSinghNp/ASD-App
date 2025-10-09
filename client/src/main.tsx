
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductCatalogue from './ProductCatalogue';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductCatalogue />
  </StrictMode>,
)
// =======
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App";

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

