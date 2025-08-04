import { useGatherFuelTx } from "~/hooks/useGatherFuel";
import { deserializeDatum} from "@meshsdk/core";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { UTxO } from "@meshsdk/core";


export default function GatherFuel(){

    async function handleUtxo(utxo: UTxO){
        setPelletUtxo(utxo)
        const deserialized = await deserializeDatum(utxo.output.plutusData!)
        setPelletCoOrds([Number(deserialized.fields[0].int), Number(deserialized.fields[1].int) ])
        console.log(pelletCoOrds)

    }

    const {handleSubmit, pelletUtxoList, setPelletUtxo, pelletUtxo, availableFuel, setAvailableFuel, fuel, setFuel, txHash , pelletCoOrds, setPelletCoOrds} = useGatherFuelTx()
    
    
    return (
        <div className="mb-5">
            <form onSubmit={handleSubmit} className="flex flex-col">
                
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-white text-black">
                       <p>Select from Pellet Utxos</p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                       
                        {pelletUtxoList?.map((utxo, index) => (

                            <DropdownMenuItem key={index} onClick={() => {handleUtxo(utxo); setAvailableFuel(Number(utxo.output.amount[2]?.quantity))}}>{utxo.input.txHash}</DropdownMenuItem>

                        ))}
                    </DropdownMenuContent>

                </DropdownMenu>
                
                 {pelletUtxo &&  
                    <div className="flex flex-col">
                        <p>Selected utxo : {pelletUtxo.input.txHash}</p> 
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