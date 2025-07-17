import { MaestroProvider } from "@meshsdk/core"
import { useEffect, useState } from "react"
import { pelletRefHashWOUtil, spacetimeRefHashWOUtil } from "config"

import { serializePlutusScript, PlutusScript } from "@meshsdk/core"
import { fromScriptRef} from "@meshsdk/core-cst";


export function useDeployPellets(){

    const [fuelPolicy, setFuelPolicy] = useState<string>()
    const [pelletAddress, setPelletAddress] = useState<string>()
    const [shipyardPolicy, setShipyardPolicy] = useState<string>()

    const clientMaestroProvider = new MaestroProvider({
        apiKey: process.env.NEXT_PUBLIC_MAESTRO_PREPROD_KEY || "",
        network: "Preprod",
    })

    useEffect( () => {

        async function getScripts(){

            const pelletRefUtxo = await clientMaestroProvider.fetchUTxOs(pelletRefHashWOUtil, 0)
            const pelletScriptRef = await fromScriptRef(pelletRefUtxo[0]?.output.scriptRef!)
            const pelletPlutusScript = pelletScriptRef as PlutusScript
            const pelletAddress = await serializePlutusScript(pelletPlutusScript).address

            const fuelPolicyId =  pelletRefUtxo[0]?.output.scriptHash

            setPelletAddress(pelletAddress)
            setFuelPolicy(fuelPolicyId)

            const spacetimeRefUtxo = await clientMaestroProvider.fetchUTxOs(spacetimeRefHashWOUtil, 0)
            const spacetimePolicyId = spacetimeRefUtxo[0]?.output.scriptHash
            setShipyardPolicy(spacetimePolicyId)

        }

        getScripts()



    }, [])


    return {fuelPolicy, shipyardPolicy, pelletAddress}



}