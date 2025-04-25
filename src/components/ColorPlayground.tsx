// components/ColorPlayground.tsx
const galaxyColors = [
    { name: 'Primary', key: 'primary', hex: '#6c2bd9' },
    { name: 'Accent', key: 'accent', hex: '#e14eca' },
    { name: 'Info', key: 'info', hex: '#3291ff' },
    { name: 'Glow', key: 'glow', hex: '#00f0ff' },
    { name: 'Base', key: 'base', hex: '#0c0a1b' },
    { name: 'Border', key: 'border', hex: '#4b445e' },
    { name: 'Light', key: 'light', hex: '#e4e4e7' },
    { name: 'Danger', key: 'danger', hex: '#ff4d4f' },
  ];
  
  export default function ColorPlayground() {
    return (
      <div className="p-6 bg-galaxy-base min-h-screen text-white">
        <h2 className="text-2xl font-bold mb-6">Galaxy Color Swatches</h2>
        <p className="text-sm text-galaxy-glow p-6">In a galaxy far far away... whole page to be deleted</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galaxyColors.map((color) => (
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
  