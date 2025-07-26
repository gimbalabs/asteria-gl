import { AssetExtended, UTxO, stringToHex, Asset, hexToString } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";
import { set } from "lodash";
import { useState, useEffect } from "react";
import { mineAsteriaRouter } from "~/server/api/routers/userTx/mineAsteriaRouter";
import { api } from "~/utils/api";

export default function useMineAsteria(assets: AssetExtended[]){

    const [txHash, setTxHash] = useState<string>("")
    const [asteriaMined, setAsteriaMined] = useState<number>()

    const prepareMineAsteria = api.mineAsteria.prepareMineAsteriaTx.useMutation()


    const {connected, wallet} = useWallet()

    async function handleSubmitMineAsteria(e: React.MouseEvent<HTMLButtonElement>){
        e.preventDefault()
        if(!connected){
            return alert("Please connect your wallet first")
        }
       

        try{

            const colateral: UTxO[] = await wallet.getCollateral()
           
            const utxos =  await wallet.getUtxos()
            const changeAddress = await wallet.getChangeAddress()

            const pilot = await assets.find((asset) => {
                    const pilotToken = asset.unit.includes(stringToHex("PILOT"))
                    return pilotToken
                        })
            
            const pilotNumber: string | undefined = hexToString(pilot!.assetName).slice(5)
            console.log(pilotNumber)

            const findPilotUtxo = await utxos.find((utxo) => utxo.output.amount.find((asset: Asset) => {
               return asset.unit.includes(stringToHex("PILOT"))

            }) )

            console.log("colateral in hook: ", colateral)

            const payload = {
                changeAddress: changeAddress,
                utxos: utxos,
                pilotNumber: pilotNumber,
                colateralUtxo: colateral[0],
                pilotUtxo: findPilotUtxo,
            }

            const {unsignedTx, error, asteriaMined} = await prepareMineAsteria.mutateAsync(payload)

            if(error){
                alert("Error"+ error)
            }

            if(unsignedTx){
            const signedTx = await wallet.signTx(unsignedTx, true);
            const txHash = await wallet.submitTx(signedTx);
            setTxHash(txHash)
        }

           
            setAsteriaMined(asteriaMined)

        }catch(error){
        
        }

    }

  return {handleSubmitMineAsteria, txHash , asteriaMined}


}