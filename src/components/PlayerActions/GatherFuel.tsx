type GatherFuelProps = {
  currentPosition: { x: number; y: number }
  fuelLevel: number
  setFuelLevel: (fuel: number) => void
}

export function GatherFuel({ currentPosition, fuelLevel, setFuelLevel }: GatherFuelProps) {
  const handleGatherFuel = () => {
    // Stub: pretend we only have a pellet at (2, 2)
    const isOnPellet = currentPosition.x === 2 && currentPosition.y === 2
    const MAX_FUEL = 10
    const FUEL_AMOUNT = 3

    if (!isOnPellet) {
      alert('You must be standing on a pellet to gather fuel!')
      return
    }

    if (fuelLevel >= MAX_FUEL) {
      alert('Fuel tank is full!')
      return
    }

    const newFuel = Math.min(fuelLevel + FUEL_AMOUNT, MAX_FUEL)
    setFuelLevel(newFuel)
    console.log(`Gathered ${FUEL_AMOUNT} fuel. New fuel level: ${newFuel}`)
  }

  return (
    <button
      className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      onClick={handleGatherFuel}
    >
      ⛽ Gather Fuel
    </button>
  )
}
