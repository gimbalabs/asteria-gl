import { api } from "~/utils/api";
import { useWallet } from "@meshsdk/react";

import { useState, useEffect } from "react";
import { Asset, stringToHex, TxOutput, UTxO, serializePlutusScript, PlutusScript} from "@meshsdk/core";
import { fromScriptRef} from "@meshsdk/core-cst";
import { hexToString } from "~/utils/hextoString";
import { adminTokenPolicy, adminTokenName } from "config";

import { spacetimeRefHashWOUtil, pelletRefHashWOUtil } from "config";

import { MaestroProvider } from "@meshsdk/core";
import { LucideAlignHorizontalDistributeCenter } from "lucide-react";


export function useGatherFuelTx(){

    const clientMaestroProvider = new MaestroProvider({
        apiKey: process.env.NEXT_PUBLIC_MAESTRO_PREPROD_KEY || "",
        network: "Preprod",
    })

    const prepareTx = api.gatherFuel.prepareGatherFuelTx.useMutation()

    const [test, setTest] = useState("Testing")
    const [pilotUtxo, setPilotUtxo] = useState<UTxO>()
    const [shipUtxo, setShipUtxo] = useState<UTxO>()
    const [pilotToken, setPilotToken] = useState<string>("")
    const [pelletUtxoList, setPelletUtxoList] = useState<UTxO[]>()
    const [pelletUtxo, setPelletUtxo] = useState<UTxO>()

    const [availableFuel, setAvailableFuel] = useState<number|undefined>()
    const [fuel, setFuel] = useState<number|undefined>()

    const { wallet, connected } = useWallet(); 

    useEffect( () => {


        async function getPelletData(){

            const pelletRefUtxo = await clientMaestroProvider.fetchUTxOs(pelletRefHashWOUtil, 0)
            const pelletScriptRef = fromScriptRef(pelletRefUtxo[0]?.output.scriptRef!)
            const pelletPlutusScript = pelletScriptRef as PlutusScript
            const pelletAddress = serializePlutusScript(pelletPlutusScript).address
                
            const pelletUtxos = await clientMaestroProvider.fetchAddressUTxOs(pelletAddress)
            setPelletUtxoList(pelletUtxos)
        }

        getPelletData()
        .catch(console.error)

    }, [])


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        try{

            const utxos = await wallet.getUtxos();
            const changeAddress = await wallet.getChangeAddress()  
            const collateral = await wallet.getCollateral()
            const assets = await wallet.getAssets()

            console.log("colateral" , collateral)

            const pilot = await assets.find((asset) => {
                const pilotToken = asset.unit.includes(stringToHex("PILOT"))
                return pilotToken
            })
            pilot ? setPilotToken(hexToString(pilot.assetName)) : alert("Please mint a ship to play the game")
   

            const pilotNumber: string | undefined = hexToString(pilot!.assetName).slice(5)
            console.log(pilotNumber)

            const findPilotUtxo = await utxos.find((utxo) => utxo.output.amount.find((asset: Asset) => {
               return asset.unit.includes(stringToHex("PILOT"))

            }) )

            setPilotUtxo(findPilotUtxo)

            const spacetimeRefUtxo = await clientMaestroProvider.fetchUTxOs(spacetimeRefHashWOUtil, 0)
            const spacetimeScriptRef = fromScriptRef(spacetimeRefUtxo[0]?.output.scriptRef!);
            const spacetimePlutusScript = spacetimeScriptRef as PlutusScript;
            const spacetimeAddress =   serializePlutusScript(spacetimePlutusScript).address;

            const spaceTimeUtxos = await clientMaestroProvider.fetchAddressUTxOs(spacetimeAddress)

            const findShipUtxo = await spaceTimeUtxos.find((utxo) => utxo.output.amount.find((asset: Asset) => {
               return asset.unit.includes(stringToHex("SHIP"+pilotNumber))

            }) )
            setShipUtxo(findShipUtxo)
            setTest(shipUtxo?.input.txHash+"#"+shipUtxo?.input.outputIndex)

            if(!pelletUtxo){
                return alert('Please select a Pellet utxo first')
            }

            if(availableFuel < fuel){
                return alert('You can only select a maximum of'+{availableFuel})
            }
           

        } 
        catch(error){
            console.log(error)
            alert("Tx Error " + error)
        }
    }

    return {handleSubmit, test, pelletUtxoList, setPelletUtxo, pelletUtxo, setAvailableFuel, availableFuel, fuel, setFuel}

}