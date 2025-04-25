import { galaxyColors } from "tailwind.config";

  
  export default function ColorPlayground() {
    const colors = Object.entries(galaxyColors).map(([key, hex]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the key
      key,
      hex,
    }));
    return (
      <div className="p-6 bg-galaxy-base min-h-screen text-white">
        <h2 className="text-2xl font-bold mb-6">Galaxy Color Swatches</h2>
        <p className="text-sm text-galaxy-glow p-6">In a galaxy far far away... whole page to be deleted</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {colors.map((color) => (
            <div
              key={color.key}
              className="rounded-xl p-4 shadow-md" 
              style={{ backgroundColor: color.hex }}
            >

              <p className="text-lg font-semibold">{color.name}</p>
              <p className="text-sm opacity-80">{color.hex}</p>
              <p className="text-xs mt-2 opacity-70">galaxy.{color.key}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  