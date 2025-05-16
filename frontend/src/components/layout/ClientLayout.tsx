// src/components/ClientLayout.tsx
"use client";

import React from "react";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default ClientLayout;
