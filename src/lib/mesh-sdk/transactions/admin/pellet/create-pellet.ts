import {
  Asset,
  conStr0,
  integer,
  MeshTxBuilder,
  PlutusScript,
  scriptHash,
  stringToHex,
  UTxO
} from "@meshsdk/core";
import { blockchainProvider, myWallet } from "../../../utils.js";
import { admintoken } from "../../../utils.js";
import { fromScriptRef, resolvePlutusScriptAddress } from "@meshsdk/core-cst";
import { readFile } from "fs/promises";


const changeAddress = await myWallet.getChangeAddress();
const collateral: UTxO = (await myWallet.getCollateral())[0]!;

const utxos = await myWallet.getUtxos();

const txInUtxo = utxos.find((utxo) =>
  utxo.output.amount.some(
    (asset) =>
      asset.unit ===
      admintoken.policyid + admintoken.name
  )
);

const pellet = JSON.parse(
    await readFile("./scriptref-hash/pellet-script.json", "utf-8"));
if(!pellet.pelletTxHash){
    throw Error ("pellet script-ref not found, deploy pellet first.");
};

const spacetime = JSON.parse(
    await readFile("./scriptref-hash/spacetime-script.json", "utf-8"));
if(!spacetime.asteriaTxHash){
    throw Error ("spacetime script-ref not found, deploy asteria first.");
};

const pelletUtxo = await blockchainProvider.fetchUTxOs(pellet.pelletTxHash);
const fuelPolicyID = pelletUtxo[0].output.scriptHash;

const pelletScriptRef = fromScriptRef(pelletUtxo[0].output.scriptRef!);
const pelletPlutusScript = pelletScriptRef as PlutusScript;
const pelletScriptAddress = resolvePlutusScriptAddress(pelletPlutusScript,0);


const spacetimeUtxo = await blockchainProvider.fetchUTxOs(spacetime.spacetimeTxHash);
const shipyardPolicyId = spacetimeUtxo[0].output.scriptRef;

async function createPellet(
  pelletProperty: { posX: number; posY: number; fuel: string }
) {
  const pelletDatum = conStr0([
    integer(pelletProperty.posX), //posX
    integer(pelletProperty.posY), //posY
    scriptHash(shipyardPolicyId!) //shipYarard policyId
  ]);

  const fueltokenNameHex = stringToHex("FUEL");

  const fuelToken: Asset[] = [
    {
      unit: fuelPolicyID + fueltokenNameHex,
      quantity: pelletProperty.fuel
    },
  ];
  const adminAsset: Asset[] = [
    {
      unit: admintoken.policyid + admintoken.name,
      quantity: "1"
    }
  ];

  const fuelReedemer = conStr0([]);

  const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    verbose: true
  });
  console.log(pelletScriptAddress);

  const unsignedTx = await txBuilder
    .txIn(txInUtxo!.input.txHash, txInUtxo!.input.outputIndex)
    .mintPlutusScriptV3()
    .mint(pelletProperty.fuel, fuelPolicyID!, fueltokenNameHex)
    .mintTxInReference(pellet.pelletTxHash, 0)
    .mintRedeemerValue(fuelReedemer, "JSON")

    .txOut(pelletScriptAddress, fuelToken)
    .txOutInlineDatumValue(pelletDatum, "JSON")
    .txOut(pelletScriptAddress, adminAsset)
    .txOutInlineDatumValue(pelletDatum, "JSON")
    
    .txInCollateral(
      collateral.input.txHash,
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address
    )
    .changeAddress(changeAddress)
    .selectUtxosFrom(utxos)
    .setNetwork("preprod")
    .complete();

  const signedTx = await myWallet.signTx(unsignedTx, true);
  const pelletTxhash = await myWallet.submitTx(signedTx);
  return pelletTxhash;
};

export { createPellet };