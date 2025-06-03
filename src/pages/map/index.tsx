import { useState } from "react";
import { GameGrid } from "~/components/GampMap/GameGrid";
import { MoveShip } from "~/components/PlayerActions/MoveShip";
import { ShowPilot } from "~/components/PlayerActions/ShowPilot";
import { CreateShip } from "~/components/PlayerActions/CreateShip";
import { GatherFuel } from "~/components/PlayerActions/GatherFuel";

export default function MapPage() {
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [fuelLevel, setFuelLevel] = useState(10);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 space-y-8 bg-gray-100 p-4 text-blue-950">
        <h2 className="mb-4 text-lg font-bold">Player Actions</h2>
        <div className="space-y-2">
          <CreateShip
            setCurrentPosition={setCurrentPosition}
            setFuelLevel={setFuelLevel}
          />
          <MoveShip
            currentPosition={currentPosition}
            targetPosition={targetPosition}
            setCurrentPosition={setCurrentPosition}
            setTargetPosition={setTargetPosition}
            fuelLevel={fuelLevel}
            setFuelLevel={setFuelLevel}
          />
          <ShowPilot 
            currentPosition={currentPosition} 
            fuelLevel={fuelLevel} 
          />
          <GatherFuel
            currentPosition={currentPosition}
            fuelLevel={fuelLevel}
            setFuelLevel={setFuelLevel}
          />
        </div>


      </aside>

      {/* Main Grid */}
      <main className="flex w-3/4 bg-black p-4">
        <section className="flex flex-auto items-center justify-center">
          <GameGrid
            currentPosition={currentPosition}
            targetPosition={targetPosition}
            setTargetPosition={setTargetPosition}
          />
        </section>
      </main>
    </div>
  );
}


