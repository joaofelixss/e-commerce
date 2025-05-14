// src/app/(public)/layout.tsx

import React from "react";
import Navbar from "@/components/layout/Navbar";
import MenuMobile from "@/components/layout/MenuMobile";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div>
      <Navbar />
      <MenuMobile />
      <main className="">{children}</main>
      <Footer />
      <Toaster richColors />
    </div>
  );
}
