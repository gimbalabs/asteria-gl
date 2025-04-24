import Link from "next/link";
import AdminPage from "~/pages/admin";

export default function NavBar() {
  return (
    <nav className="w-full bg-black bg-opacity-40 px-6 py-4 shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold"><Link href="/">Asteria</Link></div>
        <ul className="flex gap-4 text-sm font-medium">
          <li><Link href="/about">About</Link></li>
          <li><Link href="/admin">AdminPage</Link></li>
        </ul>
      </div>
    </nav>
  );
}
