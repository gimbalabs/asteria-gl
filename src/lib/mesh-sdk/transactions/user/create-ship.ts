import { 
    Asset,
    assetName,
    conStr,
    conStr0,
    conStr1,
    mConStr0,
    deserializeDatum,
    integer,
    MeshTxBuilder,
    PlutusScript, 
    policyId,
    posixTime,
    serializePlutusScript, 
    stringToHex, 
    UTxO,
    resolveSlotNo
} from "@meshsdk/core";

import {adminTokenName, adminTokenPolicy, refHash, asteriaRefHashWO, pelletRefHashWOUtil, spacetimeRefHashWOUtil} from '../../../../../config.js'
//import { admintoken, pelletRefHash, asteriaRefHash, spacetimeRefHash } from "../../config-dont-use.js";
//import { blockchainProvider, myWallet, slot} from "../../utils.js";
import { fromScriptRef} from "@meshsdk/core-cst";
import { maestroProvider, blockfrostProvider } from "../../utils.js";
import { readFile } from "fs/promises";





//const changeAddress = await myWallet.getChangeAddress();
//const collateral: UTxO = (await myWallet.getCollateral())[0]!;
//const utxos = await myWallet.getUtxos();
//const utxos = await blockchainProvider.fetchUTxOs("420d1b6ddff2ce1188a3d9c37459fa6325d0f1aea6dcc9b3ec1a4de9a017e59e",0);

async function createShip(
    ship_mint_lovelace_fee: number,
    initial_fuel: string,
    posX: number,
    posY: number,
    tx_latest_posix_time: number,
    changeAddress: string,
    collateral: UTxO,
    utxos: UTxO[],
){

    const txBuilder = new MeshTxBuilder({
        // submitter: blockfrostProvider,
         fetcher: maestroProvider,
         evaluator: maestroProvider,
         verbose: true
     });

console.log(collateral.output.amount)   

/*const deployScript = JSON.parse(
    await readFile("../../scriptref-hash/refhash.json", "utf-8"));
if(!deployScript.txHash){
    throw new Error ("deployScript ref not found, deploy asteria first.");
};
const spacetimeDeployScript = JSON.parse(
    await readFile("./scriptref-hash/spacetime-script.json", "utf-8"));
if(!spacetimeDeployScript.txHash){
    throw new Error ("spacetime script-ref not found, deploy spacetime first.");
}; 
const pelletDeployScript = JSON.parse(
    await readFile("./scriptref-hash/pellet-script.json", "utf-8"));
if(!pelletDeployScript.txHash){
    throw new Error ("pellet script-ref not found, deploy pellet first.");
};
*/


const asteriaRefUtxo = await maestroProvider.fetchUTxOs(asteriaRefHashWO, 0);
const spacetimeRefUtxo = await maestroProvider.fetchUTxOs(spacetimeRefHashWOUtil, 0)
const pelletRefUtxo = await maestroProvider.fetchUTxOs(pelletRefHashWOUtil, 0)

const asteriaScriptRef = fromScriptRef(asteriaRefUtxo[0].output.scriptRef!);


const asteriaPlutusScript = asteriaScriptRef as PlutusScript;
const asteriaScriptAddress  = serializePlutusScript(asteriaPlutusScript).address;
console.log("Asteria address", asteriaScriptAddress)
//const spacetimeScriptRefUtxos = await blockchainProvider.fetchUTxOs(spacetimeDeployScript.txHash);
const shipyardPolicyid =   spacetimeRefUtxo[0].output.scriptHash;
const spacetimeScriptRef = fromScriptRef(spacetimeRefUtxo[0].output.scriptRef!);
const spacetimePlutusScript = spacetimeScriptRef as PlutusScript;
const spacetimeAddress =   serializePlutusScript(spacetimePlutusScript).address;
console.log("asteriaScriptAddess ",asteriaScriptAddress)
//const pelletScriptRefUtxos = await blockchainProvider.fetchUTxOs(pelletDeployScript.txHash);
const fuelPolicyId  = pelletRefUtxo[0].output.scriptHash;
console.log("Fuel policy Id : ", fuelPolicyId)

//console.log(" spacetimeAddress: ", spacetimeAddress);
//console.log("fuel policyId : ", fuelPolicyId);
//console.log("asteria Script Address : ", asteriaScriptAddress);
//console.log("fuel policyId : ", fuelPolicyId);


const asteriaInputUtxos = await maestroProvider.fetchAddressUTxOs(asteriaScriptAddress, adminTokenPolicy+adminTokenName);


const asteria = asteriaInputUtxos[0];
const asteriaInputAda = asteria.output.amount.find((Asset) => 
    Asset.unit === "lovelace"
);

console.log("Asteria Output: ", asteria.output.amount[0], asteria.output.amount[1])
const asteriaInputData = asteria.output.plutusData;
const asteriaInputDatum = deserializeDatum(asteriaInputData!).fields;


console.log("asteria Input datum",deserializeDatum(asteriaInputData!));
//datum properties
const asteriaInputShipcounter = asteriaInputDatum[0].int;
const asteriaInputShipYardPolicyId = asteriaInputDatum[1].bytes;
console.log("asteria ship counter ", asteriaInputShipcounter)

const asteriaOutputDatum =  conStr0([
    integer(Number(Number(asteriaInputShipcounter) + 1)),  //add number of ships(ship Counter)
    policyId(asteriaInputShipYardPolicyId)
]);

console.log("asteria output datum", asteriaOutputDatum)

const fuelTokenName = stringToHex("FUEL");
const shipTokenName = stringToHex("SHIP" + Number(asteriaInputShipcounter).toString()); //ship counter from Datum
const pilotTokenName = stringToHex("PILOT" + Number(asteriaInputShipcounter).toString()); //ship counter from Datum

console.log(shipTokenName)


let nowDateTime = new Date();
let dateTimeAdd2Min = new Date(nowDateTime.getTime() + 2 *60000);
let dateTimeAdd10Min = new Date(nowDateTime.getTime() + 10 *60000);
const slot = resolveSlotNo('preprod', dateTimeAdd2Min.getTime());
console.log("Mesh Resolved Slot + 5 mins:" , slot)

const slotTen = resolveSlotNo('preprod' , dateTimeAdd10Min.getTime());

const ttl = Date.now() + 3 * 60 * 1000;
const now = Date.now() * 1000
//const ttl1 = time + 10 * 60 * 1000;
const shipDatum = conStr0([
    integer(posX),
    integer(posY),
    assetName(shipTokenName),
    assetName(pilotTokenName),
    posixTime(ttl)
]);

//console.log("ship name" , shipTokenName)
console.log("Ship Datum: ", shipDatum,'\n');
//console.log("shipyardpolicyId: ", shipyardPolicyid);

//defining assets
const assetToSpacetimeAddress: Asset[] = [{
    unit: shipyardPolicyid! + shipTokenName,
    quantity: "1"
},
{
    unit: fuelPolicyId! + fuelTokenName,
    quantity: initial_fuel
},
];
const totalRewardsAsset : Asset[] = [{
    unit: adminTokenPolicy + adminTokenName,
    quantity: "1"
},
{
    unit: "lovelace",
    quantity:  (Number(asteriaInputAda?.quantity) + ship_mint_lovelace_fee).toString()
}];

const pilotTokenAsset: Asset [] = [{
    unit: shipyardPolicyid + pilotTokenName,
    quantity: "1"
}];

const mintShipRedeemer   = conStr(0, []);
const addNewshipRedeemer = conStr(0, []);
const mintFuelRedeemer   = conStr(0, []);

console.log(mintShipRedeemer)


//console.log(asteriaInputAda,"\n");
//console.log("Asteria input Assets",asteriaInputUtxos[0].output.amount);
console.log("asteria output datum: ",asteriaOutputDatum);
console.log("Reward Assets:",  totalRewardsAsset)
//onsole.log(" Ship Datum", shipDatum);
//console.log("latest slot time", tx_latest_slot)
//console.log("slot", slot)

//console.log(tx_latest_posix_time);
    

    const unsignedTx: string =  await txBuilder

    .spendingPlutusScriptV3()
    .txIn(
        asteria.input.txHash,
        asteria.input.outputIndex,
    )
    .txInRedeemerValue(addNewshipRedeemer,"JSON")
    .spendingTxInReference(asteriaRefHashWO,0) //
    .txInInlineDatumPresent()

    .mintPlutusScriptV3()
    .mint("1",shipyardPolicyid!,shipTokenName)
    .mintTxInReference(spacetimeRefHashWOUtil,0)
    .mintRedeemerValue(mintShipRedeemer,"JSON")

    .mintPlutusScriptV3()
    .mint("1",shipyardPolicyid!,pilotTokenName)
    .mintTxInReference(spacetimeRefHashWOUtil,0)
    .mintRedeemerValue(mintShipRedeemer,"JSON")
    
    .mintPlutusScriptV3()
    .mint(initial_fuel, fuelPolicyId!, fuelTokenName)
    .mintTxInReference(pelletRefHashWOUtil, 0)
    .mintRedeemerValue(mintFuelRedeemer,"JSON")

    .txOut(asteriaScriptAddress,totalRewardsAsset)
    .txOutInlineDatumValue(asteriaOutputDatum,"JSON")

 
    .txOut(spacetimeAddress,assetToSpacetimeAddress)
    .txOutInlineDatumValue(shipDatum,"JSON")

    .txOut(changeAddress,pilotTokenAsset)
    .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex
     )
    .invalidHereafter(Number(slot))
    .selectUtxosFrom(utxos)
    .changeAddress(changeAddress)
    .setNetwork("preprod")
    .complete();

//const signedTx = await myWallet.signTx(unsignedTx, true);
//const shiptxHash = await myWallet.submitTx(signedTx);
console.log("create-ship has created the tx")
//const evalTx = await blockfrostProvider.evaluateTx(unsignedTx)
//console.log(evalTx)


return {unsignedTx};
};
export {createShip};