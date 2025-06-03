import { ReactEventHandler, useState } from "react";
import { Buffer } from "buffer";

import { useDeployAsteriaValidators } from "~/hooks/useDeployValidators";

import { api } from "~/utils/api";
import { hexToString } from "~/utils/hextoString";

import { useWallet, useAssets } from "@meshsdk/react";

import { DropdownMenu, DropdownMenuTrigger ,DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";



export default function ParametersForm(){

    const {connected} = useWallet();
    const walletItems = useAssets();

 
    const setParameters = api.setParameters.setParameters.useMutation();
    
    const { data: parameters, isLoading } =
    api.setParameters.getParameters.useQuery(
      undefined,
      { enabled: connected }
    );

    const {handleSubmit, adminToken, setAdminToken, shipMintLovelaceFee, setShipMintLovelaceFee, maxAsteriaMining, setMaxAsteriaMining,
        initialFuel, setInitialFuel, minDistance, setMinDistance, fuelPerStep, setFuelPerStep, maxShipFuel, setMaxShipFuel, 
        distance, setDistance, time, setTime, assetName, setAssetName
    } = useDeployAsteriaValidators();

    const [assetNameReadable, setAssetNameReadable] = useState("")

    function splitUnit(unit: string) {
        const adminToken = unit.slice(0, 56);
        const assetName  = unit.slice(56);
        const assetNameReadable = hexToString(unit.slice(56))
        return { adminToken, assetName, assetNameReadable };
      }
     
    async function submit(e: React.FormEvent){
        e.preventDefault();

        if (parameters) {
            const ok = window.confirm(
              "Changing the parameters would require re-deploying the contracts. Would you like to proceed?"
            );
            if (!ok) return;
          }

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

    //  nothing to show until wallet’s connected
    if (!connected) {
        return (
        <h2 className="font-bold">
            Please connect your wallet before applying parameters
        </h2>
        );
    }


    // show a loading state
    if (isLoading) {
        return <div>Loading parameters…</div>;
    }

    // 3. dynamic button classes
    const buttonClasses = parameters
        ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";

           

            return (
                <div className="flex flex-col gap-2 items-center">
                    <h2>Specify Parameters for the Game</h2>
                    // show a loading state
                


                    <form onSubmit={handleSubmit}  className="form text-galaxy-info font-bold">
                        <h3>Start by selecting an admin token from your wallet</h3>
                        <p>PolicyID: {adminToken}</p>
                        <p>AssetName: {assetNameReadable}</p>
                        <DropdownMenu>

                            <DropdownMenuTrigger className="bg-galaxy-light">
                                Select Token
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


                    <p>Admin Token PolicyId (auto fills)</p> 
                    {/* readOnly inputs with dynamic placeholders */}
                    <input
                    readOnly
                    value={adminToken}

                    placeholder={
                        parameters?.adminToken ?? ""
                    }
                    className="p-1"
                    />

                    <p>Admin Token Name (auto fills)</p> 
                    <input
                    readOnly
                    value={assetNameReadable}
                    placeholder={
                        parameters
                        ? `${Buffer.from(parameters.adminTokenName, "hex").toString(
                            "utf8"
                            )} (${parameters.adminTokenName})`
                        : ""
                    }
                    className="p-1"

                    />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        {/* all number inputs with dynamic placeholders */}
                        <p>Ship Mint Lovelace Fee</p>
                        <input

                        type="text"
                        value={shipMintLovelaceFee}
                        onChange={(e) => setShipMintLovelaceFee(e.target.value)}

                        placeholder={
                            parameters
                            ? String(parameters.shipMintLovelaceFee)
                            : ""
                        }
                        required
                        className="p-1"
                        />
                    </div>

                    <div>
                        <p>Maximum Asteria to be mined</p>
                        <input

                        type="text"
                        value={maxAsteriaMining}
                        onChange={(e) => setMaxAsteriaMining(e.target.value)}

                        placeholder={
                            parameters
                            ? String(parameters.maxAsteriaMining)
                            : ""
                        }
                        required
                        className="p-1"
                        />
                    </div>

                    <div>
                        <div className="font-semibold">Max Speed (Distance, Time):</div>
                            <div>
                                <input

                                type="text"

                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                placeholder={
                                    parameters
                                    ? String(parameters.maxSpeed.distance)
                                    : "Distance"
                                }
                                required
                                className="p-1"
                                />
                            </div>

                            <div>
                                <input
                                type="text"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder={
                                    parameters ? String(parameters.maxSpeed.timeMs) : "Time (ms)"
                                }
                                required
                                className="p-1"
                                />
                            </div>
                        </div>

                    <div>
                        <p>Fuel per step</p>
                        <input
                        type="text"
                        value={fuelPerStep}
                        onChange={(e) => setFuelPerStep(e.target.value)}
                        placeholder={
                            parameters
                            ? String(parameters.fuelPerStep)
                            : ""
                        }
                        required
                        className="p-1"
                        />
                    </div>

                    <div>
                    <p>Initial Fuel</p>
                        <input
                        type="text"
                        value={initialFuel}
                        onChange={(e) => setInitialFuel(e.target.value)}
                        placeholder={
                            parameters
                            ? String(parameters.initialFuel)
                            : ""
                        }
                        required
                        className="p-1"
                        />
                    </div>

                    <div>
                        <p>Minimum Asteria Distance</p>
                        <input
                        type="text"
                        value={minDistance}
                        onChange={(e) => setMinDistance(e.target.value)}
                        placeholder={
                            parameters
                            ? String(parameters.minAsteriaDistance)
                            : ""
                        }
                        required
                        className="p-1"
                        />
                    </div>

                    <div>
                        <p>Maximum Ship Fuel</p>
                        <input
                        type="text"
                        value={maxShipFuel}
                        onChange={(e) => setMaxShipFuel(e.target.value)}
                        placeholder={
                            parameters
                            ? String(parameters.maxShipFuel)
                            : ""
                        }
                        required
                        className="p-1 mb-4"
                        />
                    </div>
                </div>    

                <button
                type="submit"
                className={`inline-block px-6 py-3 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${buttonClasses}`}
                >
                {parameters ? "Update Parameters" : "Add Parameters"}
                </button>
            </form>
           
            


        </div>
    );
    }