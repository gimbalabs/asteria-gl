type GameGridProps = {
  currentPosition: { x: number; y: number }
  targetPosition: { x: number; y: number } | null
  setTargetPosition: (pos: { x: number; y: number }) => void
}

export function GameGrid({ currentPosition, targetPosition, setTargetPosition }: GameGridProps) {
  const GRID_SIZE = 11
  const GRID_OFFSET = Math.floor(GRID_SIZE / 2)

  return (
    <div className="grid grid-cols-11 gap-1 border w-max bg-gray-100 p-1">
      {[...Array(GRID_SIZE)].map((_, y) => (
        [...Array(GRID_SIZE)].map((_, x) => {
          const coordX = x - GRID_OFFSET
          const coordY = y - GRID_OFFSET
          const isShipHere = coordX === currentPosition.x && coordY === currentPosition.y
          const isTargetHere = targetPosition && coordX === targetPosition.x && coordY === targetPosition.y

          return (
            <div
              key={`${coordX}-${coordY}`}
              className={`w-10 h-10 flex items-center justify-center border text-xs cursor-pointer hover:bg-blue-200 ${
                isShipHere ? 'bg-green-500 text-white' : isTargetHere ? 'bg-yellow-300' : 'bg-white'
              }`}
              onClick={() => setTargetPosition({ x: coordX, y: coordY })}
            >
              {isShipHere ? '🚀' : ''}
            </div>
          )
        })
      ))}
    </div>
  )
}
