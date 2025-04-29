import { CreateShip } from "~/components/PlayerActions/CreateShip";
import { MoveShip } from "~/components/PlayerActions/MoveShip";
import { GatherFuel } from "~/components/PlayerActions/GatherFuel";
import { MineAsteria } from "~/components/PlayerActions/MineAsteria";
import { QuitGame } from "~/components/PlayerActions/QuitGame";
import { GameGrid } from "~/components/GampMap/GameGrid";

export default function MapPage() {


  return (
    <div className="flex min-h-screen">
      
    {/* Sidebar with Player actions*/}
    <div className="w-1/4 p-4 bg-gray-100">
      <h2 className="text-lg font-bold mb-4 text-galaxy-border">Player Actions</h2>
      <div className="space-y-4">
        <CreateShip />
        <MoveShip />
        <GatherFuel />
        <MineAsteria />
        <QuitGame />
      </div>
    </div>

    {/* Main Grid */}
    <div className="w-3/4 p-4">
     <GameGrid /> 
    </div>

  </div>
  );
}
