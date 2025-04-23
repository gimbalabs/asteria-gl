import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-black bg-opacity-40 px-6 py-4 shadow-md text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Asteria</div>
        <ul className="flex gap-4 text-sm font-medium">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/admin">Admin</Link></li>
          <li><Link href="/getstarted">Getting Started</Link></li>
          <li><Link href="/rules">Rules</Link></li>
          <li><Link href="/map">Map</Link></li>
        </ul>
      </div>
    </nav>
  );
}
