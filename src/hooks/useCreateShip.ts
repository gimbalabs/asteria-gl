import { api } from "~/utils/api";
import { useWallet } from "@meshsdk/react";
import { ship_mint_lovelace_fee } from "config";

import { useState } from "react";



export function useCreateShipTx(){

    const prepareTx = api.createShip.prepareCreateShipTx.useMutation();

    const [shipFee,  setShipFee]  = useState(Number(ship_mint_lovelace_fee.int)); 
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(0);
    const [initialFuel, setInitialFuel] = useState("20");

    const { wallet, connected } = useWallet(); 


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      try {
        if (!connected || !wallet) {
          throw new Error("Wallet not connected");
        }
  
        const utxos = await wallet.getUtxos();
        const changeAddress = await wallet.getChangeAddress()  
        const collateral = await wallet.getCollateral() 


        const payload = { 
          utxos,
          changeAddress,
          collateral: collateral[0] ,
          ship_mint_lovelace_fee: Number(shipFee),
          initial_fuel: initialFuel,
          posX: Number(posX),
          posY: Number(posY),
          tx_latest_posix_time: Date.now(),
        }
        
  
        
        const {unsignedTx} = await prepareTx.mutateAsync(payload);
      

        console.log(changeAddress)

        if(unsignedTx){
            const signedTx = await wallet.signTx(unsignedTx, true);
            const txHash = await wallet.submitTx(signedTx);

            console.log("Transaction Hash:", txHash);
            alert("Deployed Successfully! TxHash: " + txHash);
        } else {
          alert("Error,transaction has not built")
        }
        

        } catch (error) {
            console.error(error);
            alert("Tranasction Failed");
        }
        
    
    
    
    }

    return {shipFee, setShipFee, posX, setPosX, posY, setPosY, initialFuel, setInitialFuel, handleSubmit}

}