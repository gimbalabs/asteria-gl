import Link from "next/link";
import AdminPage from "~/pages/admin";
import { CardanoWallet } from "@meshsdk/react";

export default function NavBar() {
  return (
    <nav className="w-full fixed top-0 z-50 bg-gradient-to-b from-galaxy-primary to-[#000000]
     px-6 py-4 shadow-md text-galaxy-accent">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold"><Link href="/">Asteria</Link></div>
        <ul className="flex gap-4 items-center text-sm font-medium">
          <li className="flex items-center"><Link href="/about">About</Link></li>
          <li className="flex items-center"><Link href="/admin">AdminPage</Link></li>
          <li className="flex items-center"><CardanoWallet isDark={true} persist={true}/></li>
        </ul>
      </div>
    </nav>
  );
} 
