import { galaxyColors } from 'tailwind.config';
import ColorPlayground from '~/components/ColorPlayground';

const colors = Object.entries(galaxyColors).map(([key, hex]) => ({
  name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize nicely
  key,
  hex,
}));
console.log(colors);

export default function StyleGuide() {
  return (
    <main className="min-h-screen bg-galaxy-base text-white p-8 space-y-12">
      <section>
        <h1 className="text-4xl font-bold mb-4">Asteria Style Guide</h1>
        <p className="text-lg text-galaxy-light">Version 1.0 - Consistency is power.</p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Color Tokens</h2>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-galaxy-border">
              <tr>
                <th className="py-3 px-6">Token</th>
                <th className="py-3 px-6">Hex Code</th>
                <th className="py-3 px-6">Preview</th>
              </tr>
            </thead>
            <tbody>
              {colors.map((color) => (
                <tr key={color.key} className="border-t border-galaxy-border">
                  <td className="py-2 px-6">galaxy.{color.key}</td>
                  <td className="py-2 px-6">{color.hex}</td>
                  <td className="py-2 px-6">
                    <div className={`w-8 h-8 rounded-full bg-galaxy-${color.key}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mt-12 mb-4">Color Swatches</h2>
        <ColorPlayground />
      </section>

      <section>
        <h2 className="text-3xl font-bold mt-12 mb-4">Typography</h2>
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">Heading 1 - 5xl</h1>
          <h2 className="text-4xl font-bold">Heading 2 - 4xl</h2>
          <h3 className="text-3xl font-semibold">Heading 3 - 3xl</h3>
          <p className="text-lg">Body text - large</p>
          <p className="text-sm text-galaxy-light">Small helper text</p>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mt-12 mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-galaxy-primary hover:bg-galaxy-accent text-white font-semibold py-2 px-4 rounded-xl">
            Primary Action
          </button>
          <button className="bg-galaxy-info hover:bg-galaxy-glow text-white font-semibold py-2 px-4 rounded-xl">
            Info Action
          </button>
          <button className="bg-galaxy-danger hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl">
            Danger Action
          </button>
        </div>
      </section>
    </main>
  )
}
