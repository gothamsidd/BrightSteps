import React from "react";
import Header from "@/components/header";

const MainLayout = async ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen container mx-auto mt-24 mb-20">{children}</main>
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          <p>Made by gothamsidd</p>
        </div>
      </footer>
    </>
  );
};

export default MainLayout;
