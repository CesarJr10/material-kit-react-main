import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from './contexts/AuthContext';  // Ajusta la ruta de importación si es necesario
import App from './app';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <Suspense>
          <App />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);
