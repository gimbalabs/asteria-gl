

import { setMaxIdleHTTPParsers } from "http";
import { useState } from "react";
import Trpc from "~/pages/api/trpc/[trpc]";


import { api } from "~/utils/api";

import { useWallet, useAssets } from "@meshsdk/react";

import { DropdownMenu, DropdownMenuTrigger ,DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";



export default function ParametersForm(){
    
    const [adminToken, setAdminToken] = useState("")
    const [shipFee, setShipFee] = useState("")
    const [maxAsteria, setMaxAsteria] = useState("")
    const [fuelPerStep, setFuelPerStep] = useState("")
    const [distance, setDistance] = useState("")
    const [time, setTime] = useState("")
    const [initialFuel, setInitialFuel] = useState("")
    const [minDistance, setMinDistance] = useState("")

    const [selectedToken, setSelectedToken] = useState("")

    const setParameters = api.setParameters.prepareParameters.useMutation()

    const {connected} = useWallet()
    const walletItems = useAssets()

    
    
     
    async function submit(e: React.FormEvent){
        e.preventDefault()

        const response = await setParameters.mutateAsync({
            adminToken, 
            shipFee, 
            maxAsteria, 
            fuelPerStep, 
            maxSpeed: {distance, time}, 
            initialFuel, 
            minDistance
        })

        alert(response.success)


    }

    

    return (

        <div className="flex flex-col gap-2 items-center">


            <h2>Specify Parameters for the Game</h2>
        

            {connected ? 

            <form onSubmit={submit} className="form text-galaxy-info font-bold">
                <h3>Start by selecting an admin token from your wallet</h3>
                <p>{selectedToken}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-galaxy-light">
                        Select Token From Your Wallet
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        
                    {
                        walletItems?.map((i, index) => {

                            return (
                                <DropdownMenuCheckboxItem
                                    
                                    onSelect={(e) => setSelectedToken(i.unit)}
                                >
                                    {i.unit}
                                </DropdownMenuCheckboxItem>
                            )
                        })
                    }

                    </DropdownMenuContent>

                </DropdownMenu>
                
                <input
                    type="text"
                    placeholder="Admin Token Policy Id"
                    value={adminToken}
                    onChange={(e) => setAdminToken(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="number"
                    placeholder="Fee to mint new ship (Ada)"
                    value={shipFee}
                    onChange={(e) => setShipFee(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="number"
                    placeholder="Maximum Asteria to be mined"
                    value={maxAsteria}
                    onChange={(e) => setMaxAsteria(e.target.value)}
                    required
                    className="p-1"
                />
                
                <div className="semibold">Max Speed (Distance, Time)</div>

                <input
                    type="number"
                    placeholder="Distance"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="number"
                    placeholder="Time in Milliseconds"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="p-1 mb-4"
                />

                <input
                    type="number"
                    placeholder="Maximum fuel per step"
                    value={fuelPerStep}
                    onChange={(e) => setFuelPerStep(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="number"
                    placeholder="Initial Fuel"
                    value={initialFuel}
                    onChange={(e) => setInitialFuel(e.target.value)}
                    required
                    className="p-1"
                />
        
                <input
                    type="number"
                    placeholder="Min Asteria Distance"
                    value={minDistance}
                    onChange={(e) => setMinDistance(e.target.value)}
                    required
                    className="p-1"
                />
        
        
                <button className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" type="submit">Confirm Parameters</button>


            </form>:
            <h2 className="font-bold"> Please connect your wallet before applying parameters</h2>
            }
        </div>
    )

}