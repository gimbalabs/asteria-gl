import { maestroProvider} from "~/server/provider/maestroProvider"

import {
        fromScriptRef,
        } from "@meshsdk/core-cst";

import { serializePlutusScript, PlutusScript } from "@meshsdk/core";


export async function  getScriptDetails(refHash){

    const refUtxo = await maestroProvider.fetchUTxOs(refHash, 0)
   
    const scriptRef = fromScriptRef(refUtxo[0].output.scriptRef!)

    const policyId = refUtxo[0].output.scriptHash

    const plutusScript = scriptRef as PlutusScript
    const address =  serializePlutusScript(plutusScript).address
  
    return {policyId, address, refUtxo}

}