import { maestroProvider } from "~/server/provider/maestroProvider";
import {  fromScriptRef} from "@meshsdk/core-cst";
import { 
    UTxO, 
    PlutusScript,
    serializePlutusScript,
    deserializeAddress,
    stringToHex,
    deserializeDatum,
    conStr,
    conStr0,
    conStr1,
    mConStr0,
    mConStr1, 
    integer,
    byteString,
    policyId,
    Asset,
    ConStr,
    resolveSlotNo,
    MeshTxBuilder
} from "@meshsdk/core";
import { AdminToken } from "./gatherFuel";
import { asteriaRefHashWO, spacetimeRefHashWOUtil } from "config";





export async function mineAsteria(){



    const txBuilder = new MeshTxBuilder({
    fetcher: maestroProvider,
    evaluator: maestroProvider,
    verbose: true
})

    const unsignedTx = await txBuilder

    .spendingPlutusScriptV3
    .txIn(asteriaUtxo, 0)
    .txInInlineDatumPresent()
    .spendingTxInReference(asteriaRefHashWO, 0)
    .txInRedeemerValue(mineIndex1)
    
    .mintPlutusScriptV3()
    .mintRedeemerValue(burnship,index1)
    .mint(-shipYardPolicy, asset)
    .mintTxInReference(spacetimeRefHashWOUtil, 0)

    .spendingPlutusScriptV3()
    .txIn(shipUtxo, 0)
    .txInInlineDatumPresent()
    .txInRedeemerValue(mineAsteriaRedeemer, index2)
    .spendingTxInReference(spacetimeRefHashWOUtil, 0)

    

    return {}


}