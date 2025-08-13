import Mapbutton from "~/components/Mapbutton";
import React, { ReactNode, useState } from "react";
import GameActionsModal from "~/components/user/GameActionsModal";
import { FuelIcon, LoaderPinwheel, RocketIcon } from "lucide-react";
import { FuelPelletIcon, ShipIcon3 } from "~/components/ui/Icons";
import { AssetExtended, hexToString } from "@meshsdk/core";


import getGameState from "~/hooks/useGameState";
import { useMoveShip } from "~/hooks/useMoveShip";

export interface MatchingPellet {
    txHash: string;
    index: number;
    fuel: number;
    posX: number;
    posY: number;
    
}

const GRID_SIZE = 100;

function generateGrid() {
    const grid = [];
    for (let y = -GRID_SIZE / 2; y < GRID_SIZE / 2; y++) {
        const row = [];
        for (let x = -GRID_SIZE / 2; x < GRID_SIZE / 2; x++) {
            row.push({ x, y, content: null as string | null, alt: null as string | null  });
        }
        grid.push(row);
    }
    return grid;
}

export default function MapPage() {
    const [grid, setGrid] = useState<{ x: number; y: number; content: string | null | ReactNode, alt: string| null }[][]>(generateGrid()); // state managed iteration of game grid
    const [inputValue, setInputValue] = useState("");
    const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null); // state to store the selected grid cell which the user has clicked on 
    const [zoom, setZoom] = useState(1); // State to manage zoom level
    
    const [seeShip, setSeeShip] = useState(false);
    const [activeShip, setActiveShip] = useState<{shipName: string, posX: number, posY: number, fuel: number}>({shipName: "", posX: 0, posY: 0, fuel: 0});
    const [pilot, setPilot] = useState<AssetExtended | null>(null); // State to store the selected pilot

    const [matchingPelletUtxo, setMatchingPelletUtxo] = useState<MatchingPellet>({txHash: "", index: 0, fuel: 0, posX: 0, posY: 0});


    const { shipState, isLoadingPelletState, isError, pelletState, isLoadingShipState} = getGameState()  // obtains the shipState and pelletState from the useGameState hook, this pulls data from the blockchain - querying the validator addresses of ship and pellet
    const {setNewPosX, setNewPosY, newPosX, newPosY, handleMoveShip, handleShipState ,shipStateDatum} = useMoveShip(pilot)


    const handleCellClick = (x: number, y: number) => {
        setSelectedCell({ x, y });
        setNewPosX(x)
        setNewPosY(y)
    };

    const handleAddContent = () => {
        if (selectedCell) {
            setGrid((prevGrid) => {
                return prevGrid.map((row) =>
                    row.map((cell) =>
                        cell.x === selectedCell?.x && cell.y === selectedCell?.y
                            ? { ...cell, content: inputValue , alt: ""}
                            : cell
                    )
                );
            });
            setInputValue("");
            setSelectedCell(null);
        }
    };

    function addPellets(posX, posY, fuel){
         setGrid((prevGrid) => {
                return prevGrid.map((row) =>
                    row.map((cell) =>
                        cell.x === posX && cell.y === posY
                            ? { ...cell, content: fuel < 15 ? <FuelIcon className="text-galaxy-danger"/> : <FuelIcon className="text-galaxy-glow" /> , alt: fuel}
                            : cell
                    )
                );
            });
    }

    function addShips(posX, posY, shipName, fuel){

       

        setGrid((prevGrid) => {
                return prevGrid.map((row) =>
                    row.map((cell) =>
                        cell.x === posX && cell.y === posY
                            ? { ...cell, content: <div className="z-1 bg-galaxy-base" onMouseOut={() => setSeeShip(false)} onMouseOver={() => handleRocketHover(posX, posY, shipName, fuel)}><RocketIcon   className="text-galaxy-accent font-xl z-1"/></div>, alt: shipName}
                            : cell
                    )
                );
            });
        
        if(!pilot){
            return
        }
        
        let assetName = hexToString(pilot.assetName)
       
        if(shipName.slice(4,6) === assetName.slice(5,7)){
            pelletState.forEach((pellet) => {
                if(pellet.posX === posX && pellet.posY === posY){
                    setMatchingPelletUtxo({txHash: pellet.utxo, index: pellet.index, fuel: pellet.fuel, posX: pellet.posX, posY: pellet.posY})
                }
            })
        
        }


    }

    function handleRocketHover(posX, posY, shipName, fuel){
        setSeeShip(true)
        setActiveShip({shipName, posX, posY, fuel})

    }

   function handleAddShips(){
        
    shipState?.map(ship => {
            addShips(Number(ship.posX), Number(ship.posY), ship.name, ship.fuel)

        })

          pelletState.map(pellet => {
            addPellets(Number(pellet.posX), Number(pellet.posY), pellet.fuel)
        })

    }

    if(isError){
        return <p>Something went wrong, {isError}</p>
    }
    
    if(isLoadingPelletState || isLoadingShipState){
        return <LoaderPinwheel />;
    }


    return (
        <>
            <GameActionsModal pilot={pilot} setPilot={setPilot} newPosX={newPosX} newPosY={newPosY} handleMoveShip={handleMoveShip} handleShipState={handleShipState} shipStateDatum={shipStateDatum} matchingPelletUtxo={matchingPelletUtxo}/>

        <div>
        
        <Mapbutton/>
            <div className="controls">
                {shipState? <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200" onClick={handleAddShips}>Update Game State</button>: null}
            </div>
            <div
                className="grid"
                style={{
                    position: "relative",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "280vh",
                    backgroundImage: "url('/visualizer/background.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transform: `scale(${zoom})`, // Apply zoom level
                    transformOrigin: "center", // Zoom from the center
                }}
            >
                {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="row" style={{ display: "flex" }}>
                        {row.map((cell) => (
                            <div
                                key={`${cell.x},${cell.y}`}
                                className="cell"
                                style={{
                                    width: "15px",
                                    height: "15px",
                                    border: "0.1px solid black",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundImage:
                                        selectedCell?.x === cell.x && selectedCell?.y === cell.y
                                            ? "linear-gradient(rgba(128, 128, 128, 0.5), rgba(128, 128, 128, 0.5))"
                                            : "none",
                                }}
                                onClick={() => handleCellClick(cell.x, cell.y)}
                            >
                               <div className="flex justify-center ">{cell.content}{seeShip && activeShip.posX === cell.x && activeShip.posY === cell.y? <ShipInfo shipName={activeShip.shipName} posX={activeShip.posX} posY={activeShip.posY} fuel={activeShip.fuel}/>: null}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </>
  );
};

const ShipInfo = ({ shipName, posX, posY, fuel }) => {
  return (
    <div className="absolute bg-galaxy-base text-white p-4 rounded-md">
      <h4>Ship Info</h4>
      <pre>
        {JSON.stringify({ shipName, posX, posY, fuel }, null, 2)}
      </pre>
    </div>
  );
};
