import { createRoot } from 'react-dom/client';
import { Root } from './Root';
import React from 'react';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <React.StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </React.StrictMode>,
);
