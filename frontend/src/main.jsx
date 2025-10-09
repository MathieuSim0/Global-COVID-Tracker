import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import AppRoutes from './routes/AppRoutes.jsx'
// Import i18n configuration
import './i18n'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AppRoutes />
  </StrictMode>,
)
