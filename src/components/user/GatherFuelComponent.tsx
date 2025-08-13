import { useGatherFuelTx } from "~/hooks/useGatherFuel";
import { deserializeDatum} from "@meshsdk/core";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { UTxO } from "@meshsdk/core";
import { AssetExtended } from "@meshsdk/core";
import { MatchingPellet } from "~/pages/map";
import PlayButton from "../PlayButton";


export default function GatherFuel({pilot, matchingPelletUtxo}: {pilot: AssetExtended | null, matchingPelletUtxo: MatchingPellet}) {

    async function handleUtxo(utxo: MatchingPellet){
        setPelletUtxo(utxo)
        setPelletCoOrds([Number(matchingPelletUtxo.posX), Number(matchingPelletUtxo.posY) ])
        console.log(pelletCoOrds)

    }

    const {handleSubmit, setPelletUtxo, pelletUtxo, availableFuel, setAvailableFuel, fuel, setFuel, txHash , pelletCoOrds, setPelletCoOrds} = useGatherFuelTx(pilot)
    
    
    return (
        <div className="mb-5">
            <form onSubmit={handleSubmit} className="flex flex-col">    
                <p>You've landed on a fuel pellet, select the amount of fuel to take</p>
                

                    <button type="button" onClick={() => {handleUtxo(matchingPelletUtxo); setAvailableFuel(Number(matchingPelletUtxo.fuel))}}>Check available fuelCheck available fuel</button>
              
                
                 {pelletUtxo &&  
                    <div className="flex flex-col">
                        <p>Selected utxo : {pelletUtxo.txHash}</p> 
                        <p>Available Fuel: {availableFuel} </p>
                       
                        <div className="flex flex-col">
                            <p>Grid Refs...</p>
                            <p>X: {pelletCoOrds && pelletCoOrds[0]} </p>
                            <p>Y: {pelletCoOrds && pelletCoOrds[1]}</p>
                          
                        </div>
                        
                       
                    </div>
                    
                
                }

                <div>
                    <input
                        className="w-full rounded-md border border-gray-600 bg-gray-700 p-2 text-white"
                        value={fuel}
                        placeholder="Choose fuel to take"
                        onChange={(e) => setFuel(Number(e.target.value))}
                    ></input>
                </div>
                <div className="mt-4">
                    <button
                        className={`w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2`}
                        type="submit"
                    >
                        Gather Fuel
                    </button>
                </div>
            </form>
      
            {txHash && <p>Gather fuel has been submitted, hash...{txHash}  </p>}
        </div>
    )

}