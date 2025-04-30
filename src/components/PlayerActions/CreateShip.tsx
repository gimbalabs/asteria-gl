import { useState } from 'react'

type CreateShipProps = {
  setCurrentPosition: (pos: { x: number; y: number }) => void
  setFuelLevel: (fuel: number) => void
}

export function CreateShip({ setCurrentPosition, setFuelLevel }: CreateShipProps) {
  const [pilotName, setPilotName] = useState('')

  const handleCreateShip = () => {
    if (!pilotName.trim()) {
      alert('Please enter a pilot name.')
      return
    }

    // Stub: Generate random position
    const GRID_RADIUS = 5
    let x = 0, y = 0
    while (Math.abs(x) + Math.abs(y) < 2) {
      x = Math.floor(Math.random() * (GRID_RADIUS * 2 + 1)) - GRID_RADIUS
      y = Math.floor(Math.random() * (GRID_RADIUS * 2 + 1)) - GRID_RADIUS
    }

    console.log('Creating ship for pilot:', pilotName)
    setCurrentPosition({ x, y })
    setFuelLevel(10) // Example default

    // Later: call createShip({ pilot: pilotName }) on Mesh
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="Enter pilot name"
        value={pilotName}
        onChange={(e) => setPilotName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded"
      />
      <button
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleCreateShip}
      >
        🛠️ Create Ship
      </button>
    </div>
  )
}
