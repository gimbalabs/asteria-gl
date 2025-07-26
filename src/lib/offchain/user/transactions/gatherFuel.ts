import { 
    UTxO, 
    PlutusScript,
    serializePlutusScript,
    deserializeAddress,
    stringToHex,
    deserializeDatum,
    conStr,
    conStr0,
    integer,
    byteString,
    policyId,
    Asset,
    resolveSlotNo,
    hexToString,
    MeshTxBuilder
} from "@meshsdk/core";
import {  fromScriptRef} from "@meshsdk/core-cst";


import { maestroProvider } from "~/server/provider/maestroProvider";
import { error } from "console";


export interface AdminToken {
    policyId: string
    name: string
}
 

export default async function gatherFuel(
 collateralUtxo: UTxO,
 utxos: UTxO[],
 changeAddress: string,
 gatherAmount: number,
 pilotUtxo: UTxO,
 shipUtxo: UTxO,
 pelletUtxo: UTxO,  
 spaceTimeRefHash: string,
 pelletRefHash: string,
 adminToken: AdminToken
){


const spacetimeRefUtxo = await maestroProvider.fetchUTxOs(spaceTimeRefHash, 0)
const shipyardPolicyId =   spacetimeRefUtxo[0]?.output.scriptHash;
const spacetimeScriptRef = fromScriptRef(spacetimeRefUtxo[0]?.output.scriptRef!);
const spacetimePlutusScript = spacetimeScriptRef as PlutusScript;
const spacetimeAddress =   serializePlutusScript(spacetimePlutusScript).address;

console.log(spacetimeAddress)
console.log("pelletref", pelletRefHash)
console.log("spacetimeRef", spaceTimeRefHash)
const pelletRefUtxo = await maestroProvider.fetchUTxOs(pelletRefHash, 0)
const fuelPolicyId = pelletRefUtxo[0]?.output.scriptHash!;
const pelletScriptRef = fromScriptRef(pelletRefUtxo[0]?.output.scriptRef!);
const pelletPlutusScript = pelletScriptRef as PlutusScript
const pelletAddress = serializePlutusScript(pelletPlutusScript).address
console.log("pellet address", pelletAddress)

console.log("spacetimeAddress", spacetimeAddress)


const ship = shipUtxo;
    if(!ship.output.plutusData){
        throw Error("Ship datum is empty");
    };
const pellet = pelletUtxo;
     if (!pellet.output.plutusData){
        throw Error("Pellet Datum is Empty")
    };
const des = deserializeAddress(ship.output.address)
console.log("Ship Policy Id:" , shipyardPolicyId)   
console.log("fuel policy id:" , fuelPolicyId) 
console.log("Ship Payment Credential? :", des.scriptHash )
const shipInputAda = ship.output.amount.find((asset =>
    asset.unit === "lovelace"
));
const fueltokenUnit = fuelPolicyId + stringToHex("FUEL");

const shipInputFuel = ship.output.amount.find((asset) => 
    asset.unit === fueltokenUnit);

const pelletInputAda = pellet.output.amount.find((asset =>
    asset.unit === "lovelace"
));
const pelletInputFuel = pellet.output.amount.find((asset) => 
    asset.unit === fueltokenUnit);    

console.log("Ship : ", ship.output.amount)
console.log("Ship : ", shipInputAda?.unit, shipInputAda?.quantity)
console.log("Pellet : ", pellet.output.amount)


//datum

//get shipInput Datum
const shipInputData = ship.output.plutusData;
const shipInputDatum = deserializeDatum(shipInputData).fields;
console.log("ship input datum", shipInputDatum)
//get shipDatum Properties  
const ShipPosX:number = shipInputDatum[0].int;
const shipPoxY: number = shipInputDatum[1].int;
const shipTokenName: string = shipInputDatum[2].bytes;
const pilotTokenName: string= shipInputDatum[3].bytes;
console.log(hexToString(pilotTokenName))
const lastMoveLatestTime: number = shipInputDatum[4].int;

const ttl = Date.now() + 15 * 60 * 1000;

const shipOutDatum = conStr0([
    integer(ShipPosX),
    integer(shipPoxY),
    byteString(shipTokenName),
    byteString(pilotTokenName),
    integer(lastMoveLatestTime),
]);


//get pelletInput Datum
const pelletInputData = pellet.output.plutusData;
const pelletInputDatum = deserializeDatum(pelletInputData).fields;
console.log("Pellet Input", pelletInputDatum)


//get pelletDatum properties
const pelletPosX: number = pelletInputDatum[0].int;
const pelletPosY: number = pelletInputDatum[1].int;
const pelletInputShipyardPolicy: string = pelletInputDatum[2].bytes;
console.log("Pellet posX from datum ", pelletPosX)

//pellet output Datum
const pelletOuputDatum = conStr0([
    integer(pelletPosX),
    integer(pelletPosY),
    policyId(pelletInputShipyardPolicy)
]);

console.log("Pellet Datum output", pelletOuputDatum)

const pelletFuel = pelletInputFuel?.quantity
const shipFuel = shipInputFuel?.quantity



const spacetimeOutputAssets : Asset[] = [
{
    unit: shipInputAda?.unit!,
    quantity: (Number(shipInputAda?.quantity!) +5000).toString(),
    
},{
    unit: shipyardPolicyId + shipTokenName,
    quantity: "1"
},{
    unit: pelletInputFuel?.unit!,
    quantity:(Number(shipFuel!) + gatherAmount).toString()
},

];

const pelletOutputAssets : Asset[] = [
{
     unit:     pelletInputAda?.unit!,
     quantity: pelletInputAda?.quantity!
   
},
{
    unit: adminToken.policyId + adminToken.name,
    quantity: "1"
},{
    unit: pelletInputFuel?.unit!,
    quantity: (Number(pelletFuel!) - gatherAmount).toString()
},

];

console.log("Pellet output", pelletOutputAssets)
console.log("Pellet Input", pelletInputDatum)
console.log("Ship Output", spacetimeOutputAssets)


const pilottokenAsset: Asset[] = [{
    unit: shipyardPolicyId + pilotTokenName,
    quantity: "1"
}];

console.log("Pilot Token", pilottokenAsset)

//const shipRedeemer = conStr1([integer(gatherAmount)]);  //note to change redeemer index if error
//const pelletRedemer = conStr0([integer(gatherAmount)]);

console.log("gather amount ", gatherAmount)
//const shipRedeemer = mConStr1([gatherAmount]);  //note to change redeemer index if error
const shipRedeemer = conStr(1, [{int: gatherAmount}])
const pelletRedemer = conStr(0, [{int: gatherAmount}]);

console.log("Ship redeemer", shipRedeemer)


let nowDateTime = new Date();
let dateTime = new Date(nowDateTime.getTime()- 5 *60000);
const slot = resolveSlotNo('preprod', dateTime.getTime());
console.log("Mesh Resolved Slot:" , slot)

const txBuilder = new MeshTxBuilder({
    fetcher: maestroProvider,
    evaluator: maestroProvider,
    verbose: true
})

const unsignedTx = await txBuilder

.txIn(pilotUtxo.input.txHash, pilotUtxo.input.outputIndex, pilotUtxo.output.amount, pilotUtxo.output.address )
.spendingPlutusScriptV3()
.txIn(
    pellet.input.txHash,
    pellet.input.outputIndex,
    pellet.output.amount,
    pellet.output.address
)
.txInInlineDatumPresent()
.txInRedeemerValue(pelletRedemer, "JSON")
//.spendingReferenceTxInRedeemerValue(pelletRedemer,"Mesh",{mem: 2592000, steps:2500000000 })
//.spendingReferenceTxInRedeemerValue(pelletRedemer, "JSON")
.spendingTxInReference(pelletRefHash,0)
.spendingPlutusScriptV3()

.txIn(
    ship.input.txHash,
    ship.input.outputIndex,
    ship.output.amount,
    ship.output.address
)
.txInInlineDatumPresent()
.txInRedeemerValue(shipRedeemer, "JSON")
//.spendingReferenceTxInRedeemerValue(shipRedeemer, "Mesh",{mem: 2592000, steps:2500000000 })
//.spendingReferenceTxInRedeemerValue(shipRedeemer, "JSON")
.spendingTxInReference(spaceTimeRefHash,0)

.txOut(changeAddress, pilottokenAsset) 
.txOut(pelletAddress,pelletOutputAssets)
.txOutInlineDatumValue(pelletOuputDatum,"JSON")
.txOut(spacetimeAddress,spacetimeOutputAssets)
.txOutInlineDatumValue(shipOutDatum,"JSON")
.txInCollateral(
   collateralUtxo.input.txHash,
   collateralUtxo.input.outputIndex
)
.setFee("3000000")
.invalidBefore(Number(slot))
.selectUtxosFrom(utxos)
.changeAddress(changeAddress)
.setNetwork("preprod")
.complete();


return {unsignedTx}

}