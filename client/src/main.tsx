import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductCatalogue from './ProductCatalogue.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductCatalogue />
  </StrictMode>,
)