import { api } from "~/utils/api";
import { useWallet } from "@meshsdk/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { adminTokenName } from "config";






export function useDeployAsteriaValidators(){

  const preparePelletTransaction = api.deployAsteriaValidators.preparePelletTransaction.useMutation();
  const prepareAsteriaTransaction = api.deployAsteriaValidators.prepareAsteriaValidator.useMutation();
  const prepareSpaceTimeTransaction = api.deployAsteriaValidators.prepareSpaceTimeValidator.useMutation();

    const [adminToken,  setAdminToken]  = useState("");
    const [assetName, setAssetName] = useState("");
    const [shipMintLovelaceFee, setShipMintLovelaceFee] = useState("");
    const [maxAsteriaMining, setMaxAsteriaMining] = useState("");
    const [initialFuel, setInitialFuel] = useState("");
    const [minDistance, setMinDistance] = useState("");
    const [fuelPerStep, setFuelPerStep] = useState("");
    const [maxShipFuel, setMaxShipFuel] = useState("");

    const [pelletHash, setPelletHash] = useState("")
    const [asteriaHash, setAsteriaHash] = useState("")


    const [distance, setDistance] = useState("");
    const [time, setTime] = useState("");

    const { wallet, connected } = useWallet(); 


    const handleSubmitPellet = async (e: React.FormEvent) => {
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
        
        
        const {unsignedTx} = await preparePelletTransaction.mutateAsync(payload);

        console.log(changeAddress)

        console.log("received unsigned tx")

        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        setPelletHash(txHash)
        

        console.log("Pellet Transaction Hash:", txHash);
        alert("Deployed Pellet Successfully! TxHash: " + txHash);
       


        } catch (error) {
            console.error(error);
            alert("Tranasction Failed");
        }
        
    }  
    
     const handleSubmitAsteria = async (e: React.FormEvent) => {
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
          pelletHash,
        }
        
        
        const {unsignedTx} = await prepareAsteriaTransaction.mutateAsync(payload);

        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        setAsteriaHash(txHash)
        

        console.log("Asteria Transaction Hash:", txHash);
        alert("Deployed Asteria Successfully! TxHash: " + txHash);
       


        } catch (error) {
            console.error(error);
            alert("Tranasction Failed");
        }
        
    }   

    const handleSubmitSpacetime = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
    

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
          pelletHash,
          asteriaHash
        }
        
        const {unsignedTx} = await prepareSpaceTimeTransaction.mutateAsync(payload)
        
        console.log("received spacetime unsigned tx")

        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);

        console.log("Spacetime Transaction Hash:", txHash);
        alert("Deployed Spacetime Successfully! TxHash: " + txHash);

        /*const write = await writeFile(
          "./scriptref-hash/deploy-scripts.json",
          JSON.stringify({ spacetime: txHash, asteria: asteriaHash, pellet: pelletHash })
         );*/



      } catch(error){
        alert("tx failed: " + error)
        console.log(error)
      }

    }



    return {handleSubmitPellet, handleSubmitAsteria, handleSubmitSpacetime, adminToken, setAdminToken, shipMintLovelaceFee, setShipMintLovelaceFee,
      maxAsteriaMining, setMaxAsteriaMining, initialFuel, setInitialFuel, minDistance, setMinDistance,
      fuelPerStep, setFuelPerStep, distance, time, setDistance, setTime, maxShipFuel, setMaxShipFuel, assetName, setAssetName, pelletHash, asteriaHash, setPelletHash, setAsteriaHash
     }
}