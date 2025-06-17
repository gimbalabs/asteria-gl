//import { api } from "~/utils/api";
import { useWallet } from "@meshsdk/react";
import { pelletRefHash, spacetimeRefHash } from "config";
import { useState } from "react";
import { Asset, stringToHex, TxOutput, UTxO, serializePlutusScript, PlutusScript} from "@meshsdk/core";
import { fromScriptRef} from "@meshsdk/core-cst";
import { hexToString } from "~/utils/hextoString";


import { spacetimeRefHashWOUtil } from "config";

import { MaestroProvider } from "@meshsdk/core";


export function useGatherFuelTx(){

    const clientMaestroProvider = new MaestroProvider({
        apiKey: process.env.NEXT_PUBLIC_MAESTRO_PREPROD_KEY,
        network: "Preprod",
    })

    //const prepareTx = api.gatherFuel.prepareGatherFuelTx.useMutation()

    const [test, setTest] = useState("Testing")
    const [pilotUtxo, setPilotUtxo] = useState<UTxO>()
    const [shipUtxo, setShipUtxo] = useState<UTxO>()
    const [pilotToken, setPilotToken] = useState<string>("")

    const { wallet, connected } = useWallet(); 

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        try{

            const utxos = await wallet.getUtxos();
            const changeAddress = await wallet.getChangeAddress()  
            const collateral = await wallet.getCollateral() 
            const assets = await wallet.getAssets()

            const pilot = assets.find((asset) => {
                const pilotToken = asset.unit.includes(stringToHex("PILOT"))
                return pilotToken
            })
            pilot ? setPilotToken(hexToString(pilot.assetName)) : alert("Please mint a ship to play the game")
   

            const pilotNumber = pilotToken.slice(5)
         

            const findPilotUtxo = utxos.find((utxo) => utxo.output.amount.find((asset: Asset) => {
               return asset.unit.includes(stringToHex("PILOT"))

            }) )

            setPilotUtxo(findPilotUtxo)

            const spacetimeRefUtxo = await clientMaestroProvider.fetchUTxOs(spacetimeRefHashWOUtil, 0)
            const spacetimeScriptRef = fromScriptRef(spacetimeRefUtxo[0]?.output.scriptRef!);
            const spacetimePlutusScript = spacetimeScriptRef as PlutusScript;
            const spacetimeAddress =   serializePlutusScript(spacetimePlutusScript).address;

            const spaceTimeUtxos = await clientMaestroProvider.fetchAddressUTxOs(spacetimeAddress)

            const findShipUtxo = spaceTimeUtxos.find((utxo) => utxo.output.amount.find((asset: Asset) => {
               return asset.unit.includes(stringToHex("SHIP"+pilotNumber))

            }) )
            setShipUtxo(findShipUtxo)
            setTest(shipUtxo?.input.txHash+"#"+shipUtxo?.input.outputIndex)


        } 
        catch(error){
            console.log(error)
            alert("Tx Error " + error)
        }
    }

    return {handleSubmit, test}

}