"use client";

import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";

export default function PublicPageLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
      <MobileBottomNav />
    </>
  );
}
