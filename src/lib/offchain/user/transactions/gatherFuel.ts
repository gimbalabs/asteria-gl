import { 
    UTxO, 
    PlutusScript,
    serializePlutusScript,
    stringToHex,
    deserializeDatum,
    conStr0,
    conStr1, 
    integer,
    byteString,
    policyId,
    Asset
} from "@meshsdk/core";
import { fromScriptRef} from "@meshsdk/core-cst";
import { MeshTxBuilder } from "@meshsdk/core";
import { hexToString } from "@meshsdk/core";


import { maestroProvider } from "~/server/provider/maestroProvider";
import { error } from "console";


interface AdminToken {
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

const pelletRefUtxo = await maestroProvider.fetchUTxOs(pelletRefHash, 0)
const fuelPolicyId = pelletRefUtxo[0]?.output.scriptHash!;
const pelletScriptRef = fromScriptRef(pelletRefUtxo[0]?.output.scriptRef!);
const pelletPlutusScript = pelletScriptRef as PlutusScript
const pelletAddress = serializePlutusScript(pelletPlutusScript).address

console.log("Pilot UTXO, pilot name" , hexToString(pilotUtxo.output.amount[1]?.unit))

const ship = shipUtxo;
    if(!ship.output.plutusData){
        throw Error("Ship datum is empty");
    };
const pellet = pelletUtxo;
     if (!pellet.output.plutusData){
        throw Error("Pellet Datum is Empty")
    };

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
console.log(shipInputDatum)
//get shipDatum Properties
const ShipPosX:number = shipInputDatum[0].int;
const shipPoxY: number = shipInputDatum[1].int;
const shipTokenName: string = shipInputDatum[2].bytes;
const pilotTokenName: string= shipInputDatum[3].bytes;
console.log(hexToString(pilotTokenName))
const lastMoveLatestTime: number = shipInputDatum[4].int;

const ttl = Date.now() + 30 * 60 * 1000;

const shipOutDatum = conStr0([
    integer(ShipPosX),
    integer(shipPoxY),
    byteString(shipTokenName),
    byteString(pilotTokenName),
    integer(ttl),
]);


//get pelletInput Datum
const pelletInputData = pellet.output.plutusData;
const pelletInputDatum = deserializeDatum(pelletInputData).fields;
console.log("Pellet Input", pelletInputDatum)


//get pelletDatum properties
const pelletPosX: number = pelletInputDatum[0].int;
const pelletPosY: number = pelletInputDatum[1].int;
const pelletInputShipyardPolicy: string = pelletInputDatum[2].bytes;

//pellet output Datum
const pelletOuputDatum = conStr0([
    integer(pelletPosX),
    integer(pelletPosY),
    policyId(pelletInputShipyardPolicy)
]);


const pelletFuel = pelletInputFuel?.quantity
const shipFuel = shipInputFuel?.quantity



const spacetimeOutputAssets : Asset[] = [{
    unit: shipyardPolicyId + shipTokenName,
    quantity: "1"
},{
    unit: pelletInputFuel?.unit!,
    quantity:(Number(shipFuel!) + gatherAmount).toString()
},
/*{
    unit: shipInputAda?.unit!,
    quantity: shipInputAda?.quantity!,
    
}*/
];

const pelletOutputAssets : Asset[] = [{
    unit: adminToken.policyId + adminToken.name,
    quantity: "1"
},{
    unit: pelletInputFuel?.unit!,
    quantity: (Number(pelletFuel!) - gatherAmount).toString()
},
/*{
     unit:     pelletInputAda?.unit!,
     quantity: pelletInputAda?.quantity!
   
}*/
];

console.log("Pellet output", pelletOutputAssets)
console.log("Ship Output", spacetimeOutputAssets)

const pilottokenAsset: Asset[] = [{
    unit: shipyardPolicyId + pilotTokenName,
    quantity: "1"
}];

console.log("Pilot Token", pilottokenAsset)

const shipRedeemer = conStr1([integer(gatherAmount)]);  //note to change redeemer index if error
const pelletRedemer = conStr0([integer(gatherAmount)]);

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
.spendingReferenceTxInRedeemerValue(pelletRedemer,"JSON")
.spendingTxInReference(pelletRefHash,0)
.txInInlineDatumPresent()
.spendingPlutusScriptV3()
.txIn(
    ship.input.txHash,
    ship.input.outputIndex,
    ship.output.amount,
    ship.output.address
)
.spendingReferenceTxInRedeemerValue(shipRedeemer, "JSON")
.spendingTxInReference(spaceTimeRefHash,0)
.txInInlineDatumPresent()

.txOut(changeAddress, pilottokenAsset) 
.txOut(pelletAddress,pelletOutputAssets)
.txOutInlineDatumValue(pelletOuputDatum,"JSON")
.txOut(spacetimeAddress,spacetimeOutputAssets)
.txOutInlineDatumValue(shipOutDatum,"JSON")
.txInCollateral(
   collateralUtxo.input.txHash,
   collateralUtxo.input.outputIndex
)
.setFee("2000000")
.selectUtxosFrom(utxos)
.changeAddress(changeAddress)
.setNetwork("preprod")
.complete();


return {unsignedTx}

}