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
    MeshTxBuilder,
    hexToString
} from "@meshsdk/core";
import { adminTokenPolicy, adminTokenName, max_asteria_mining } from "config";
import { asteriaRefHashWO, pelletRefHashWOUtil, spacetimeRefHashWOUtil } from "config";





export async function mineAsteria(shipUtxo: UTxO, collateralUtxo: UTxO, pilotUtxo: UTxO, changeAddress: string, utxos: UTxO[]){

    const asteriaRefUtxo = await maestroProvider.fetchUTxOs(asteriaRefHashWO, 0);
    const asteriaScriptRef = fromScriptRef(asteriaRefUtxo[0]!.output.scriptRef!);
    const asteriaPlutusScript = asteriaScriptRef as PlutusScript;
    const asteriaScriptAddress  = serializePlutusScript(asteriaPlutusScript).address;


    const asteriaInputUtxos = await maestroProvider.fetchAddressUTxOs(asteriaScriptAddress, adminTokenPolicy+adminTokenName);
    
    if(!asteriaInputUtxos){
        return {
            error:  "No utxo found at Asteria script Address"
        }
    }
    
    const asteria = asteriaInputUtxos[0];
    const asteriaInputAda = asteria!.output.amount.find((Asset) => 
        Asset.unit === "lovelace"
    );

    //calculate amount of lovelace to be mined
    const maxMining = Number(max_asteria_mining.int)
    const asteriaMined = (maxMining/100) * Number(asteriaInputAda?.quantity)
    const remainingAsteriaLovelace = (1 - (maxMining/100)) * Number(asteriaInputAda?.quantity)
    
    console.log("Asteria Output: ", asteria!.output.amount[0], asteria!.output.amount[1])
    const asteriaInputData = asteria!.output.plutusData;
    const asteriaInputDatum = deserializeDatum(asteriaInputData!).fields;
    const asteriaInputShipcounter = asteriaInputDatum[0].int;
    const asteriaInputShipYardPolicyId = asteriaInputDatum[1].bytes;
    console.log("asteria ship counter ", asteriaInputShipcounter)

    const asteriaOutputDatum =  conStr0([
        integer(asteriaInputShipcounter),  //add number of ships(ship Counter)
        policyId(asteriaInputShipYardPolicyId)
    ]);

    const asteriaRedeemer = conStr(1, [])
    

    const spacetimeRefUtxo = await maestroProvider.fetchUTxOs(spacetimeRefHashWOUtil, 0)
    const shipyardPolicyId =   spacetimeRefUtxo[0]?.output.scriptHash;

    const shipInputData = shipUtxo.output.plutusData;
    const shipInputDatum = deserializeDatum(shipInputData!).fields;
    console.log("ship input datum", shipInputDatum)
    //get shipDatum Properties  

    const shipTokenName: string = shipInputDatum[2].bytes;
    const pilotTokenName: string= shipInputDatum[3].bytes;

    const shipInputAda = shipUtxo.output.amount.find((asset =>
    asset.unit === "lovelace"
    ));

    const shipInputFuel = shipUtxo.output.amount.find((asset) => 
        asset.unit === stringToHex("FUEL"))

    console.log("ship input fuel", shipInputFuel!.quantity)

    const shipBurnRedeemer = conStr(1, [])

    const pelletRefUtxo = await maestroProvider.fetchUTxOs(pelletRefHashWOUtil, 0)
    const fuelPolicyId = pelletRefUtxo[0]?.output.scriptHash!;

    const valueToUser: Asset [] = [
    {
    unit: shipyardPolicyId + stringToHex(pilotTokenName),
    quantity: "1"
    },
    {
    unit: "lovelace",
    quantity: Number(asteriaMined + Number(shipInputAda?.quantity)).toString()
    }
    ];

    console.log("User Assets: " , valueToUser)

    const valueToAsteria: Asset[] = [{
        unit: adminTokenPolicy + adminTokenName,
        quantity: "1"
    },
    {
        unit: "lovelace",
        quantity:  remainingAsteriaLovelace.toString()
    }]

    console.log("Asteria Assets", valueToAsteria)

    const fuelBurnRedeemer = conStr(1 , [])
    const mineAsteriaRedeemer = conStr(2, [])

    const txBuilder = new MeshTxBuilder({
    fetcher: maestroProvider,
    evaluator: maestroProvider,
    verbose: true
    })

    const unsignedTx = await txBuilder

    .txIn(pilotUtxo.input.txHash, pilotUtxo.input.outputIndex)

    .spendingPlutusScriptV3()
    .txIn(asteria!.input.txHash, asteria!.input.outputIndex)
    .txInInlineDatumPresent()
    .spendingTxInReference(asteriaRefHashWO, 0)
    .txInRedeemerValue(asteriaRedeemer)
    
    .mintPlutusScriptV3()
    .mintRedeemerValue(shipBurnRedeemer)
    .mint("-1", shipyardPolicyId!, stringToHex(shipTokenName))
    .mintTxInReference(spacetimeRefHashWOUtil, 0)

    .mintPlutusScriptV3()
    .mintRedeemerValue(fuelBurnRedeemer)
    .mint(shipInputFuel!.quantity, fuelPolicyId, stringToHex("FUEL"))
    .mintTxInReference(pelletRefHashWOUtil, 0)

    .spendingPlutusScriptV3()
    .txIn(shipUtxo.input.txHash, shipUtxo.input.outputIndex)
    .txInInlineDatumPresent()
    .txInRedeemerValue(mineAsteriaRedeemer)
    .spendingTxInReference(spacetimeRefHashWOUtil, 0)

    .txOut(changeAddress, valueToUser)
    .txOut(asteriaScriptAddress, valueToAsteria )
    .txOutInlineDatumValue(asteriaOutputDatum)

    .txInCollateral(
        collateralUtxo.input.txHash,
        collateralUtxo.input.outputIndex
    )

    .setFee("2000000")
    .selectUtxosFrom(utxos)
    .changeAddress(changeAddress)
    .setNetwork("preprod")
    .complete();

    

    return {unsignedTx, asteriaMined}


}