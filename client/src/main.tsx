import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ProductCatalogue from "./ProductCatalogue.tsx"; // product catalogue function
import Checkout from "./Checkout.tsx"; //Checkout function
import Filter from "./Filter.tsx"; // Filter function

import Cart from "./Cart.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Checkout /> //changed fromm App */}
    <ProductCatalogue /> //render product catalouge
    {/* <Cart /> */}
  </StrictMode>
);
