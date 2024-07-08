import React, { ReactNode } from 'react';
import type { Metadata } from "next";
import AppWrappers from './AppWrappers';
import { AuthProvider } from 'contexts/AuthContext';
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body id={'root'}>
        <AuthProvider>
          <Toaster />
          <AppWrappers>{children}</AppWrappers>
        </AuthProvider>
      </body>
    </html>
  );
}
