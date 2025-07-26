import { serializePlutusScript, PlutusScript} from "@meshsdk/core";
import { maestroProvider } from "~/server/provider/maestroProvider";
import {  fromScriptRef} from "@meshsdk/core-cst";


export async function deserializeRefHash(refHash: string, index: number = 0){

    const refUtxo = await maestroProvider.fetchUTxOs(refHash, index);
    const scriptRef = fromScriptRef(refUtxo[0]!.output.scriptRef!);
    const plutusScript = scriptRef as PlutusScript;
    const scriptAddress  = serializePlutusScript(plutusScript).address;
    const policyId = refUtxo[0]?.output.scriptHash

    return {
        scriptAddress,
        policyId
    }

}