import { ReactEventHandler, useState } from "react";
import { Buffer } from "buffer";

import { useDeployAsteriaValidators } from "~/hooks/useDeployValidators";

import { api } from "~/utils/api";
import { hexToString } from "~/utils/hextoString";

import { useWallet, useAssets } from "@meshsdk/react";

import { DropdownMenu, DropdownMenuTrigger ,DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";



export default function ParametersForm(){
   
    const setParameters = api.setParameters.setParameters.useMutation();
   

    const {handleSubmit, adminToken, setAdminToken, shipMintLovelaceFee, setShipMintLovelaceFee, maxAsteriaMining, setMaxAsteriaMining,
        initialFuel, setInitialFuel, minDistance, setMinDistance, fuelPerStep, setFuelPerStep, maxShipFuel, setMaxShipFuel, 
        distance, setDistance, time, setTime, assetName, setAssetName
    } = useDeployAsteriaValidators();

    const [assetNameReadable, setAssetNameReadable] = useState("")



    const {connected} = useWallet();
    const walletItems = useAssets();

    function splitUnit(unit: string) {
        const adminToken = unit.slice(0, 56);
        const assetName  = unit.slice(56);
        const assetNameReadable = hexToString(unit.slice(56))
        return { adminToken, assetName, assetNameReadable };
      }
    
    
     
    async function submit(e: React.FormEvent){
        e.preventDefault();

        setParameters.mutateAsync({
            adminToken: adminToken,
            adminTokenName: assetName,       
            shipMintLovelaceFee: Number(shipMintLovelaceFee),
            maxAsteriaMining:    Number(maxAsteriaMining),
            maxSpeed: { distance: Number(distance), timeMs: Number(time) },
            maxShipFuel: Number(maxShipFuel),
            fuelPerStep: Number(fuelPerStep),
            initialFuel: Number(initialFuel),
            minAsteriaDistance:  Number(minDistance),
          });
    }

   

    return (

        <div className="flex flex-col gap-2 items-center">


            <h2>Specify Parameters for the Game</h2>
        

            {connected ? 

            <form onSubmit={handleSubmit} onClick={submit} className="form text-galaxy-info font-bold">
                <h3>Start by selecting an admin token from your wallet</h3>
                <p>PolicyID: {adminToken}</p>
                <p>AssetName: {assetNameReadable}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-galaxy-light">
                        Select Token From Your Wallet
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-galaxy-light">
                        
                    {
                        walletItems?.map((i) => {
                            const { adminToken, assetName, assetNameReadable} = splitUnit(i.unit);
                            return (
                                <DropdownMenuCheckboxItem
                                    key={i.unit}
                                    onSelect={() => {         
                                        setAdminToken(adminToken);           // hex policy ID
                                        setAssetName(assetName);         // UTF‑8 asset name
                                        setAssetNameReadable(assetNameReadable)
                                    }}
                                    
                                    
                                >
                                    {assetNameReadable}
                                </DropdownMenuCheckboxItem>

                            )
                        })
                    }

                    </DropdownMenuContent>

                </DropdownMenu>
                
                <input
                    type="text"
                    placeholder="Admin Token PolicyId (fills automatically)"
                    value={adminToken}
                    readOnly
                    className="p-1"
                />

                <input
                    type="text"
                    placeholder="Admin Token Name (fills automatically)"
                    value={assetNameReadable}
                    readOnly
                    className="p-1"
                />

                <input
                    type="text"
                    placeholder="Fee to mint new ship (lovelace)"
                    value={shipMintLovelaceFee}
                    onChange={(e) => setShipMintLovelaceFee(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="text"
                    placeholder="Maximum Asteria to be mined"
                    value={maxAsteriaMining}
                    onChange={(e) => setMaxAsteriaMining(e.target.value)}
                    required
                    className="p-1 mb-4"
                />
                
                <div className="semibold">Max Speed (Distance, Time):</div>

                <input
                    type="text"
                    placeholder="Distance"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="text"
                    placeholder="Time in Milliseconds"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="p-1 mb-4"
                />

                <input
                    type="text"
                    placeholder="Fuel per step"
                    value={fuelPerStep}
                    onChange={(e) => setFuelPerStep(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="text"
                    placeholder="Initial Fuel"
                    value={initialFuel}
                    onChange={(e) => setInitialFuel(e.target.value)}
                    required
                    className="p-1"
                />
        
                <input
                    type="text"
                    placeholder="Min Asteria Distance"
                    value={minDistance}
                    onChange={(e) => setMinDistance(e.target.value)}
                    required
                    className="p-1"
                />

                <input
                    type="text"
                    placeholder="Maximum Ship Fuel"
                    value={maxShipFuel}
                    onChange={(e) => setMaxShipFuel(e.target.value)}
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