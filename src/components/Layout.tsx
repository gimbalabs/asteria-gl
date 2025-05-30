import { type ReactNode } from "react";
import NavBar from "./NavBar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <main className="flex mt-16 min-h-screen flex-col items-center justify-center min-h-screen bg-gradient-to-b from-galaxy-primary to-[#000000] text-white">
        {children}
      </main>
    </>
  );
} 
