import Link from "next/link";

export default function PlayButton() {
  return (
    <Link
      href="/map"
      className="
        inline-block
        px-6 py-3
        bg-blue-600 text-white font-semibold
        rounded-lg
        shadow-md
        hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500
        transition
      "
    >
      Play Now
    </Link>
  );
}
