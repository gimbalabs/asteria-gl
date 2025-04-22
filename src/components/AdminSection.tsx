import { type ReactNode } from "react";

type AdminSectionProps = {
  title: string;
  icon?: string;
  borderColor?: string; // e.g., "border-yellow-500"
  children: ReactNode;
};

export default function AdminSection({
  title,
  icon,
  borderColor = "border-gray-700",
  children,
}: AdminSectionProps) {
  return (
    <section
      className={`bg-gray-800 p-6 rounded-xl shadow-md border ${borderColor}`}
    >
      <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <span>{title}</span>
      </h2>
      <div>{children}</div>
    </section>
  );
}
