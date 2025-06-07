import { 
    Asset,
    assetName,
    conStr0,
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
} from "@meshsdk/core";


import { admintoken, refHash } from "../../config-dont-use.js";
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
         fetcher: blockfrostProvider,
         //evaluator: blockfrostProvider,
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


const deployScriptUtxos = await maestroProvider.fetchUTxOs(refHash);

const asteriaScriptRef = fromScriptRef(deployScriptUtxos[0].output.scriptRef!);

const asteriaPlutusScript = asteriaScriptRef as PlutusScript;
const asteriaScriptAddress  = serializePlutusScript(asteriaPlutusScript).address;

//const spacetimeScriptRefUtxos = await blockchainProvider.fetchUTxOs(spacetimeDeployScript.txHash);
const shipyardPolicyid =   deployScriptUtxos[2].output.scriptHash;
const spacetimeScriptRef = fromScriptRef(deployScriptUtxos[2].output.scriptRef!);
const spacetimePlutusScript = spacetimeScriptRef as PlutusScript;
const spacetimeAddress =   serializePlutusScript(spacetimePlutusScript).address;

//const pelletScriptRefUtxos = await blockchainProvider.fetchUTxOs(pelletDeployScript.txHash);
const fuelPolicyId  = deployScriptUtxos[1].output.scriptHash;

//console.log(" spacetimeAddress: ", spacetimeAddress);
//console.log("fuel policyId : ", fuelPolicyId);
//console.log("asteria Script Address : ", asteriaScriptAddress);
//console.log("fuel policyId : ", fuelPolicyId);


const asteriaInputUtxos = await maestroProvider.fetchAddressUTxOs(asteriaScriptAddress,admintoken.policyid+admintoken.name);


const asteria = asteriaInputUtxos[0];
const asteriaInputAda = asteria.output.amount.find((Asset) => 
    Asset.unit === "lovelace"
);

console.log(asteria)
const asteriaInputData = asteria.output.plutusData;
const asteriaInputDatum = deserializeDatum(asteriaInputData!).fields;


console.log("asteria Input datum",asteriaInputDatum);
//datum properties
const asteriaInputShipcounter = asteriaInputDatum[0].int;
const asteriaInputShipYardPolicyId = asteriaInputDatum[1].bytes;
console.log("asteria ship counter ", asteriaInputShipcounter)

const asteriaOutputDatum =  conStr0([
    integer(BigInt(Number(asteriaInputShipcounter) + 1)),  //add number of ships(ship Counter)
    policyId(asteriaInputShipYardPolicyId)
]);

console.log(asteriaOutputDatum)

const fuelTokenName = stringToHex("FUEL");
const shipTokenName = stringToHex("SHIP" + Number(asteriaInputShipcounter).toString()); //ship counter from Datum
const pilotTokenName = stringToHex("PILOT" + Number(asteriaInputShipcounter).toString()); //ship counter from Datum

console.log(shipTokenName)

const blockTime = await blockfrostProvider.fetchLatestBlock()
const time = blockTime.time;
const slot = blockTime.slot;
const tx_earliest_slot = Number(slot) - 60;
const tx_earliest_posix_time = time - 60 * 1000; 
const tx_latest_slot = Number(slot) + 600

const ttl = Date.now() + 10 * 60 * 1000;
const now = Date.now() * 1000
//const ttl1 = time + 10 * 60 * 1000;
const shipDatum = conStr0([
    integer(BigInt(posX)),
    integer(BigInt(posY)),
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
}];
const totalRewardsAsset : Asset[] = [{
    unit: admintoken.policyid + admintoken.name,
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

const mintShipRedeemer   = mConStr0([]);
const addNewshipRedeemer = mConStr0([]);
const mintFuelRedeemer   = mConStr0([]);

console.log(mintShipRedeemer)


//console.log(asteriaInputAda,"\n");
//console.log("Asteria input Assets",asteriaInputUtxos[0].output.amount);
console.log("asteria output datum: ",asteriaOutputDatum);
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
    .spendingReferenceTxInRedeemerValue(addNewshipRedeemer,"Mesh",{mem: 2000000, steps:2500000000 })
    .spendingTxInReference(refHash,0) //

    .txInInlineDatumPresent()
    .txOut(asteriaScriptAddress,totalRewardsAsset)
    .txOutInlineDatumValue(asteriaOutputDatum,"JSON")
    .mintPlutusScriptV3()
    .mint("1",shipyardPolicyid!,shipTokenName)
    .mintTxInReference(refHash,2)
    .mintRedeemerValue(mintShipRedeemer,"Mesh",{mem: 2000000, steps:2500000000 })
    .mintPlutusScriptV3()
    .mint("1",shipyardPolicyid!,pilotTokenName)
    .mintTxInReference(refHash,2)
    .mintRedeemerValue(mintShipRedeemer,"Mesh",{mem: 2000000, steps:2500000000 })
    .mintPlutusScriptV3()
    .mint(initial_fuel, fuelPolicyId!, fuelTokenName)
    .mintTxInReference(refHash, 1)
    .mintRedeemerValue(mintFuelRedeemer,"Mesh",{mem: 2000000, steps:2500000000 })
    .txOut(spacetimeAddress,assetToSpacetimeAddress)
    .txOutInlineDatumValue(shipDatum,"JSON")
    .txOut(changeAddress,pilotTokenAsset)
    .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex
     )
     .invalidHereafter(tx_latest_slot)
    .selectUtxosFrom(utxos)
    .setFee("2000000")
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