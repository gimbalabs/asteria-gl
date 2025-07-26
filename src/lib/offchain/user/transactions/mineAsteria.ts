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
    console.log("check utxo" ,pilotUtxo.output.amount[0],pilotUtxo.output.amount[1])
    const asteriaRefUtxo = await maestroProvider.fetchUTxOs(asteriaRefHashWO, 0);
    const asteriaScriptRef = fromScriptRef(asteriaRefUtxo[0]!.output.scriptRef!);
    const asteriaPlutusScript = asteriaScriptRef as PlutusScript;
    const asteriaScriptAddress  = serializePlutusScript(asteriaPlutusScript).address;
    console.log("Asteria script address:", asteriaScriptAddress)

    //obtain slot time 
    let nowDateTime = new Date();
    let dateTime = new Date(nowDateTime.getTime()- 5 *60000);
    const slot = resolveSlotNo('preprod', dateTime.getTime());

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
    
    console.log("Asteria Input rewards: ", asteria!.output.amount[0], asteria!.output.amount[1])
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
// error after here
    const shipTokenName: string = shipInputDatum[2].bytes;
    const pilotTokenName: string= shipInputDatum[3].bytes;

    const shipInputAda = shipUtxo.output.amount.find((asset =>
    asset.unit === "lovelace"
    ));

    const shipInputFuel = shipUtxo.output.amount.find((asset) => 
        asset.unit.startsWith(stringToHex("FUEL"), 56))

    const fuelToBurn = (Number(shipInputFuel?.quantity)* -1).toString()

    console.log("type of", typeof fuelToBurn)
    console.log("ship input fuel", fuelToBurn)

    const shipBurnRedeemer = conStr(1, [])

    const pelletRefUtxo = await maestroProvider.fetchUTxOs(pelletRefHashWOUtil, 0)
    const fuelPolicyId = await pelletRefUtxo[0]?.output.scriptHash!;
    console.log("fuel policy Id", fuelPolicyId)

    const valueToUser: Asset [] = [
    {
    unit: shipyardPolicyId + pilotTokenName,
    quantity: "1"
    },
    {
    unit: "lovelace",
    quantity: (Number(asteriaMined + Number(shipInputAda?.quantity))).toString()
    }
    ];

    console.log("User Assets: " , valueToUser)

    const valueToAsteria: Asset[] = [
    {
        unit: "lovelace",
        quantity:  remainingAsteriaLovelace.toString()
    },
    {
        unit: adminTokenPolicy + adminTokenName,
        quantity: "1"
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
    .spendingTxInReference(asteriaRefHashWO, 0)
    .txInRedeemerValue(asteriaRedeemer, "JSON")
    .txInInlineDatumPresent()


    .spendingPlutusScriptV3()
    .txIn(shipUtxo.input.txHash, shipUtxo.input.outputIndex)
    .txInRedeemerValue(mineAsteriaRedeemer, "JSON")
    .spendingTxInReference(spacetimeRefHashWOUtil, 0)
    .txInInlineDatumPresent()
    
    .mintPlutusScriptV3()
    .mint("-1", shipyardPolicyId!, shipTokenName)
    .mintRedeemerValue(shipBurnRedeemer, "JSON")
    .mintTxInReference(spacetimeRefHashWOUtil, 0)

    .mintPlutusScriptV3()
    .mint(fuelToBurn, fuelPolicyId, stringToHex("FUEL"))
    .mintRedeemerValue(fuelBurnRedeemer, "JSON")
    .mintTxInReference(pelletRefHashWOUtil, 0)


   
    .txInCollateral(
       collateralUtxo.input.txHash,
        collateralUtxo.input.outputIndex
    )

    .txOut(changeAddress, valueToUser)
    .txOut(asteriaScriptAddress, valueToAsteria )
    .txOutInlineDatumValue(asteriaOutputDatum, "JSON")

    .invalidBefore(Number(slot))
    .setFee("2000000")
    .selectUtxosFrom(utxos)
    .changeAddress(changeAddress)
    .setNetwork("preprod")
    .complete();

    

    return {unsignedTx, asteriaMined}


}