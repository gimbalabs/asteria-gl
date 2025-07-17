import { useGatherFuelTx } from "~/hooks/useGatherFuel";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "../ui/dropdown-menu";


export default function GatherFuel(){

    const {handleSubmit, handleGridRefs, test, pelletUtxoList, setPelletUtxo, pelletUtxo, availableFuel, setAvailableFuel, fuel, setFuel, txHash , pelletCoOrds} = useGatherFuelTx()
    
    
    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-white text-black">
                       <p>Select from Pellet Utxos</p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                       
                        {pelletUtxoList?.map((utxo, index) => (

                            <DropdownMenuItem key={index} onClick={() => {setPelletUtxo(utxo); setAvailableFuel(Number(utxo.output.amount[2]?.quantity))}}>{utxo.input.txHash}</DropdownMenuItem>

                        ))}
                    </DropdownMenuContent>

                </DropdownMenu>
                
                 {pelletUtxo &&  
                    <div className="flex flex-col">
                        <p>Selected utxo : {pelletUtxo.input.txHash}</p> 
                        <p>Available Fuel: {availableFuel} </p>
                       
                        <div>
                            <button onClick={handleGridRefs}>Get Grid Refs</button>
                            {pelletCoOrds && <p className="text-white">X: {pelletCoOrds.x}</p>}
                        </div>
                        
                       
                    </div>
                    
                
                }

                <input className="text-black" value={fuel} placeholder="Choose fuel to take" onChange={(e) => setFuel(Number(e.target.value))}></input>
                
                <button type="submit">Click to test</button>
            </form>
            <pre className="text-white">{JSON.stringify({test})}</pre>
            {txHash && <p>Gather fuel has been submitted, hash...{txHash}  </p>}
        </div>
    )

}