import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Filter from './Filter.tsx';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Filter />
  </StrictMode>,
)