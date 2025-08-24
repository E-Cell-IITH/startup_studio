import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './Context/userContext.jsx';
import { ToastProvider } from './Context/toastContext.jsx';

createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ToastProvider>
      <UserProvider>
        <BrowserRouter>
          <StrictMode>
            <App />
          </StrictMode>
        </BrowserRouter>
      </UserProvider>
    </ToastProvider>
  </GoogleOAuthProvider>,
)
