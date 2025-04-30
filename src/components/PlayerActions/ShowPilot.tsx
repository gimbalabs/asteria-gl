type ShowPilotProps = {
    currentPosition: { x: number; y: number }
    fuelLevel: number
  }
  
  export function ShowPilot({ currentPosition, fuelLevel }: ShowPilotProps) {
    return (
      <div className="p-4 border rounded bg-white text-galaxy-border">
        <h3 className="font-bold text-lg mb-2">🚀 Ship Status</h3>
        <p>Position: ({currentPosition.x}, {currentPosition.y})</p>
        <p>Fuel: {fuelLevel}</p>
      </div>
    )
  }
  