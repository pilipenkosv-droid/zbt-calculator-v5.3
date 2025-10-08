import React from 'react';
import '../styles/theme.css';
import '../styles/ui.css';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="pageRoot">
    {children}
  </div>
);

