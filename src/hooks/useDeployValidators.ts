import { api } from "~/utils/api";
import { useWallet } from "@meshsdk/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { adminTokenName } from "config";





export function useDeployAsteriaValidators(){

  const prepareTransaction = api.deployAsteriaValidators.prepareTransaction.useMutation();

    const [adminToken,  setAdminToken]  = useState("");
    const [assetName, setAssetName] = useState("");
    const [shipMintLovelaceFee, setShipMintLovelaceFee] = useState("");
    const [maxAsteriaMining, setMaxAsteriaMining] = useState("");
    const [initialFuel, setInitialFuel] = useState("");
    const [minDistance, setMinDistance] = useState("");
    const [fuelPerStep, setFuelPerStep] = useState("");
    const [maxShipFuel, setMaxShipFuel] = useState("");


    const [distance, setDistance] = useState("");
    const [time, setTime] = useState("");

    const { wallet, connected } = useWallet(); 


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();


      try {
        if (!connected || !wallet) {
          throw new Error("Wallet not connected");
        }
  
        const utxos = await wallet.getUtxos();
        const changeAddress = await wallet.getChangeAddress()   

        const payload = { 
          utxos,
          adminToken: adminToken,
          adminTokenName: assetName,
          fuelPerStep: Number(fuelPerStep),
          initialFuel: Number(initialFuel),
          minAsteriaDistance: Number(minDistance),
          shipMintLovelaceFee: Number(shipMintLovelaceFee),
          maxAsteriaMining: Number(maxAsteriaMining),
          maxSpeed: {distance: Number(distance), time: Number(time)},
          maxShipFuel: Number(maxShipFuel),
          changeAddress,
        }
        
  
        
        const {unsignedTx, asteriaScriptAddress, pelletScriptAddress, spaceTimeAddress} = await prepareTransaction.mutateAsync(payload);

        console.log(changeAddress)

        console.log("received unsigned tx")

        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);


        console.log("Transaction Hash:", txHash);
        alert("Deployed Successfully! TxHash: " + txHash);
        let content = `Asteria refScriptHash: ${txHash}#0 Address: ${asteriaScriptAddress} , Pellet refScriptHash: ${txHash}#1 Address: ${pelletScriptAddress} , SpaceTime refScriptHash: ${txHash}#2 Address: ${spaceTimeAddress}` 

        console.log(content)

        } catch (error) {
            console.error(error);
            alert("Tranasction Failed");
        }
        
    }   

    return {handleSubmit, adminToken, setAdminToken, shipMintLovelaceFee, setShipMintLovelaceFee,
      maxAsteriaMining, setMaxAsteriaMining, initialFuel, setInitialFuel, minDistance, setMinDistance,
      fuelPerStep, setFuelPerStep, distance, time, setDistance, setTime, maxShipFuel, setMaxShipFuel, assetName, setAssetName
     }
}