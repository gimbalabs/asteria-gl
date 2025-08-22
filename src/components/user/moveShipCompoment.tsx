import { useMoveShip } from "~/hooks/useMoveShip";
//import { useElapsedSeconds } from "~/hooks/useElapsedSeconds";
import MineAsteria from "./MineAsteriaComponent";
import { AssetExtended } from "@meshsdk/core";


export default function MoveShipComponent({pilot, newPosX, newPosY, currentX, currentY, handleMoveShip, handleShipState, shipStateDatum}: {pilot: AssetExtended | null, newPosX: number, newPosY: number, currentX:number, currentY: number, handleMoveShip: any, handleShipState: any, shipStateDatum: any}) {
    const {assets, setNewPosX, setNewPosY} = useMoveShip(pilot);
    //const {secs, possibleSteps} = useElapsedSeconds(shipStateDatum?.posixTime, shipStateDatum?.fuel);
    console.log("new X: ", newPosX)
    console.log("Pilot: ", pilot)

    return (
      <div className="flex flex-col">
        <h1>Move Ship</h1>
        <button
          onClick={handleShipState}
          style={{
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Get Ship Details
        </button>
        <div>
          <p>1. Fuel: {shipStateDatum?.fuel}</p>
          <p>2. Coordinate X: {shipStateDatum?.coordinateX}</p>
          <p>3. Coordinate Y: {shipStateDatum?.coordinateY}</p>
          <p>4. Ship Name: {shipStateDatum?.shipName}</p>
          <p>5. Pilot Name: {shipStateDatum?.pilotName}</p>
          {shipStateDatum?.posixTime && (
            <p>6. Next Move Time: {new Date(shipStateDatum.posixTime).toString()}</p>
          )}
        </div>
        <div>
          <form
            onSubmit={(e) => {
             
                handleMoveShip(e);
              }}
            className="flex flex-col items-center gap-2 text-black"
          >
            <h2 className="text-blue-500">
              Choose you coordinates and the Click the button to Move your
              Asteria Ship
            </h2>
            <input
              value={newPosX}
              placeholder="Enter the new X Coordinate"
              onChange={(e) => {
                setNewPosX(Number(e.target.value));
              }}
            />
           
            `{" "}
            <input
              value={newPosY}
              placeholder="Enter the new Y Coordinate"
              onChange={(e) => {
                setNewPosY(Number(e.target.value));
              }}
            />
            <button
              type="submit"
              className={`inline-block bg-blue-500 rounded-lg px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2`}
            >
              Move ship
            </button>
          </form>
        </div>
        <div>
          {shipStateDatum && assets && currentX === 0 && currentY=== 0  && <MineAsteria assets={assets} pilot={pilot} />}
        </div>
      </div>
    );
}