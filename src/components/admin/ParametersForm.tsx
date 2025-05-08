import { useState } from "react";
import { Buffer } from "buffer";


import { api } from "~/utils/api";

import { useWallet, useAssets } from "@meshsdk/react";

import { DropdownMenu, DropdownMenuTrigger ,DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem } from "../ui/dropdown-menu";



export default function ParametersForm(){

    const {connected} = useWallet();
    const walletItems = useAssets();

    const { data: parameters, isLoading } =
    api.setParameters.getParameters.useQuery(
      undefined,
      { enabled: connected }
    );

    const setParameters = api.setParameters.setParameters.useMutation();
    
    const [shipFee, setShipFee] = useState("");
    const [maxAsteria, setMaxAsteria] = useState("");
    const [fuelPerStep, setFuelPerStep] = useState("");
    const [distance, setDistance] = useState("");
    const [time, setTime] = useState("");
    const [initialFuel, setInitialFuel] = useState("");
    const [minDistance, setMinDistance] = useState("");
    const [policyId,  setPolicyId]  = useState("");
    const [assetName, setAssetName] = useState("");
    const [maxShipFuel, setMaxShipFuel] = useState(""); 
    
    function splitUnit(unit: string) {
        const policyId = unit.slice(0, 56);
        const assetName  = unit.slice(56);
        return { policyId, assetName };
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
            adminToken:     policyId,
            adminTokenName: assetName,        // hex as‑is
            shipMintLovelaceFee: Number(shipFee),
            maxAsteriaMining:    Number(maxAsteria),
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
        <form onSubmit={submit} className="form text-galaxy-info font-bold">
            <h3>Select an admin token from your wallet</h3>

            <DropdownMenu>
            <DropdownMenuTrigger className="bg-galaxy-light">
                Select Token
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {walletItems?.map((i) => {
                const { policyId, assetName } = splitUnit(i.unit);
                return (
                    <DropdownMenuCheckboxItem
                    key={i.unit}
                    onSelect={() => {
                        setPolicyId(policyId);
                        setAssetName(assetName);
                    }}
                    >
                    {policyId} +{" "}
                    {Buffer.from(assetName, "hex").toString("utf8")}
                    </DropdownMenuCheckboxItem>
                );
                })}
            </DropdownMenuContent>
            </DropdownMenu>

            {/* readOnly inputs with dynamic placeholders */}
            <input
            readOnly
            value={policyId}
            placeholder={
                parameters?.adminToken ?? "Admin Token PolicyId (auto-fill)"
            }
            className="p-1"
            />
            <input
            readOnly
            value={assetName}
            placeholder={
                parameters
                ? `${Buffer.from(parameters.adminTokenName, "hex").toString(
                    "utf8"
                    )} (${parameters.adminTokenName})`
                : "Admin Token Name (auto-fill)"
            }
            className="p-1"
            />

            {/* all number inputs with dynamic placeholders */}
            <input
            type="number"
            value={shipFee}
            onChange={(e) => setShipFee(e.target.value)}
            placeholder={
                parameters
                ? String(parameters.shipMintLovelaceFee)
                : "Fee to mint new ship (lovelace)"
            }
            required
            className="p-1"
            />

            <input
            type="number"
            value={maxAsteria}
            onChange={(e) => setMaxAsteria(e.target.value)}
            placeholder={
                parameters
                ? String(parameters.maxAsteriaMining)
                : "Maximum Asteria to be mined"
            }
            required
            className="p-1"
            />

            <div className="font-semibold">Max Speed (Distance, Time):</div>
            <input
            type="number"
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
            <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder={
                parameters ? String(parameters.maxSpeed.timeMs) : "Time (ms)"
            }
            required
            className="p-1 mb-4"
            />

            <input
            type="number"
            value={fuelPerStep}
            onChange={(e) => setFuelPerStep(e.target.value)}
            placeholder={
                parameters
                ? String(parameters.fuelPerStep)
                : "Fuel per step"
            }
            required
            className="p-1"
            />
            <input
            type="number"
            value={initialFuel}
            onChange={(e) => setInitialFuel(e.target.value)}
            placeholder={
                parameters
                ? String(parameters.initialFuel)
                : "Initial Fuel"
            }
            required
            className="p-1"
            />
            <input
            type="number"
            value={minDistance}
            onChange={(e) => setMinDistance(e.target.value)}
            placeholder={
                parameters
                ? String(parameters.minAsteriaDistance)
                : "Min Asteria Distance"
            }
            required
            className="p-1"
            />
            <input
            type="number"
            value={maxShipFuel}
            onChange={(e) => setMaxShipFuel(e.target.value)}
            placeholder={
                parameters
                ? String(parameters.maxShipFuel)
                : "Maximum Ship Fuel"
            }
            required
            className="p-1 mb-4"
            />

            <button
            type="submit"
            className={`inline-block px-6 py-3 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 ${buttonClasses}`}
            >
            {parameters ? "Update Parameters" : "Confirm Parameters"}
            </button>
        </form>
        </div>
    );
    }