import { useGatherFuelTx } from "~/hooks/useGatherFuel";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "../ui/dropdown-menu";


export default function GatherFuel(){

    const {handleSubmit, test, pelletUtxoList, setPelletUtxo, pelletUtxo, availableFuel, setAvailableFuel, fuel, setFuel} = useGatherFuelTx()
    

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-white text-black">
                       <p>Select from Pellet Utxos</p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                       
                        {pelletUtxoList?.map((utxo) => (

                            <DropdownMenuItem onClick={() => {setPelletUtxo(utxo); setAvailableFuel(Number(utxo.output.amount[1]?.quantity));}}>{utxo.input.txHash}</DropdownMenuItem>

                        ))}
                    </DropdownMenuContent>

                </DropdownMenu>
                
                 {pelletUtxo ? 
                    <div className="flex flex-col">
                        <p>Selected utxo : {pelletUtxo.input.txHash}</p> 
                        <p>Available Fuel: {availableFuel} </p>
                    </div>
                    
                
                : null}

                <input placeholder="Choose fuel to take" onChange={(e) => setFuel(Number(e.target.value))}>{fuel}</input>
                
                <button type="submit">Click to test</button>
            </form>
            <pre className="text-white">{JSON.stringify({test})}</pre>
        </div>
    )

}