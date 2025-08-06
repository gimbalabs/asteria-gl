import { maestroProvider} from "~/server/provider/maestroProvider"

import {
        fromScriptRef,
        } from "@meshsdk/core-cst";

import { serializePlutusScript, PlutusScript } from "@meshsdk/core";


export function getScriptDetails(refHash){

    const refUtxo = maestroProvider.fetchUTxOs(refHash, 0)
    const scriptRef = fromScriptRef(refHash[0]?.output.scriptRef!)
    const policyId = refHash[0].output.scriptHash
    const plutusScript = scriptRef as PlutusScript
    const address = serializePlutusScript(plutusScript).address

    return {policyId, address, refUtxo}

}