import { useState } from 'react'

const GRID_SIZE = 11
const GRID_OFFSET = Math.floor(GRID_SIZE / 2)

export function GameGrid() {
  const [shipPosition, setShipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const handleTileClick = (x: number, y: number) => {
    const deltaX = x - shipPosition.x
    const deltaY = y - shipPosition.y
    console.log(`Clicked move: Δx=${deltaX}, Δy=${deltaY}`)

    // Move the ship locally
    setShipPosition({ x, y })
  }

  return (
    <div className="grid grid-cols-11 gap-1 border w-max bg-gray-100 p-1">
      {[...Array(GRID_SIZE)].map((_, y) => (
        [...Array(GRID_SIZE)].map((_, x) => {
          const coordX = x - GRID_OFFSET
          const coordY = y - GRID_OFFSET
          const isShipHere = coordX === shipPosition.x && coordY === shipPosition.y

          return (
            <div
              key={`${coordX}-${coordY}`}
              className={`w-10 h-10 flex items-center justify-center border text-xs cursor-pointer hover:bg-blue-200 ${
                isShipHere ? 'bg-green-500 text-white' : 'bg-white'
              }`}
              onClick={() => handleTileClick(coordX, coordY)}
            >
              {isShipHere ? '🚀' : ''}
            </div>
          )
        })
      ))}
    </div>
  )
}
