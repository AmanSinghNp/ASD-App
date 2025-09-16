<<<<<<< HEAD
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProductCatalogue from './ProductCatalogue.tsx'; // product catalogue function
import Checkout from "./Checkout.tsx"; //Checkout function
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Filter from './Filter.tsx';
>>>>>>> Xiao

createRoot(document.getElementById("root")!).render(
  <StrictMode>
<<<<<<< HEAD
    <Checkout /> //changed fromm App
    <ProductCatalogue /> //render product catalouge
  </StrictMode>
);

=======
    <Filter />
  </StrictMode>,
)
>>>>>>> Xiao
