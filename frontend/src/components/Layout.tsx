import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-background">
      <Navbar />
      <main className="pt-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;