type MoveShipProps = {
  currentPosition: { x: number; y: number }
  targetPosition: { x: number; y: number } | null
  setCurrentPosition: (pos: { x: number; y: number }) => void
  setTargetPosition: (pos: { x: number; y: number }) => void
  fuelLevel: number
  setFuelLevel: (fuel: number) => void
}

export function MoveShip({
  currentPosition,
  targetPosition,
  setCurrentPosition,
  setTargetPosition,
  fuelLevel,
  setFuelLevel
}: MoveShipProps) {
  const handleMove = () => {
    if (!targetPosition) return

    const deltaX = targetPosition.x - currentPosition.x
    const deltaY = targetPosition.y - currentPosition.y
    const distance = Math.abs(deltaX) + Math.abs(deltaY)
    const fuelCost = distance * 1 // Example: 1 fuel per step

    if (fuelCost > fuelLevel) {
      alert('Not enough fuel!')
      return
    }

    setCurrentPosition(targetPosition)
    setFuelLevel(fuelLevel - fuelCost)
    setTargetPosition(null)
  }

  return (
    <button
      className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      onClick={handleMove}
      disabled={!targetPosition}
    >
      Confirm Move
    </button>
  )
}
