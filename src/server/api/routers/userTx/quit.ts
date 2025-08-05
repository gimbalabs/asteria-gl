import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { 
        pelletRefHashWOUtil,  
        spacetimeRefHashWOUtil, 
       } from "config";
import {  
        stringToHex, 
        hexToString, 
        MeshTxBuilder,
        conStr,
        conStr1,
        integer,
        Asset,
        PlutusScript,
        serializePlutusScript,
        } from "@meshsdk/core";
import {
        fromScriptRef,
        } from "@meshsdk/core-cst";

export const quitShipRouter = createTRPCRouter({
    quitShip: publicProcedure
        .input(z.object({
            pilot: z.object({
                unit: z.string(),
                policyId: z.string(),
                assetName: z.string(),
                fingerprint: z.string(),
                quantity: z.string(),
            }),
            assets: z.array(z.object({
                unit: z.string(),
                policyId: z.string(),
                assetName: z.string(),
                fingerprint: z.string(),
                quantity: z.string(),
            })),
            changeAddress: z.string(),
            utxos: z.array(z.any()),
            collateral: z.object({          // Single UTxO object
                input: z.object({
                    txHash: z.string(),
                    outputIndex: z.number(),
                }),
                output: z.object({
                    address: z.string(),
                    amount: z.any(),
                    datum: z.any().optional(),
                }),
            })
        }))
    
        .mutation(async ({ input }) => {
            //get spacetime script details
            const spacetimeRefUtxo = await maestroProvider.fetchUTxOs(spacetimeRefHashWOUtil, 0)
            const shipyardPolicyId =   spacetimeRefUtxo[0]?.output.scriptHash;
            const spacetimeScriptRef = fromScriptRef(spacetimeRefUtxo[0]?.output.scriptRef!);
            const spacetimePlutusScript = spacetimeScriptRef as PlutusScript;
            const spacetimeAddress =   serializePlutusScript(spacetimePlutusScript).address;

            //getpellet script details
            const pelletRefUtxo = await maestroProvider.fetchUTxOs(pelletRefHashWOUtil, 0)
            const fuelPolicyId = pelletRefUtxo[0]?.output.scriptHash!;
            const pelletScriptRef = fromScriptRef(pelletRefUtxo[0]?.output.scriptRef!);
            const pelletPlutusScript = pelletScriptRef as PlutusScript
            // const pelletAddress = serializePlutusScript(pelletPlutusScript).address

            // TODO: Have a dropdown on frontend for the user to select the pilot token for the ship they want to move
            const pilotAsset = input.assets.filter(
                (asset) => (asset.policyId === shipyardPolicyId) && (asset.assetName === input.pilot.assetName)
            );
            if (!pilotAsset.length) {
                throw new Error("Ship not minted yet!");
            }else if(pilotAsset.length > 1) {
                throw new Error("Multiple ships minted! Try sending the extra PILOT tokens to a different address.");
            }
            else {
                const pilotTokenName: string = hexToString(input.pilot.assetName ?? "");
                console.log(pilotTokenName);
                /// Extract the number from pilot token: eg. PILOT13 (gets "13")
                const pilotNumber = pilotTokenName.replace("PILOT", "");
                // Create ship token name by adding "SHIP" prefix (makes "SHIP13")
                const shipTokenName = stringToHex(`SHIP${pilotNumber}`);
                const spaceTimeUtxos_array = await maestroProvider.fetchAddressUTxOs(spacetimeAddress);
                const shipStateUtxo_array = spaceTimeUtxos_array.filter(
                    (utxo) => utxo.output.amount.some(
                        (asset) => asset.unit === `${shipyardPolicyId}${shipTokenName}`
                    )
                );
                const shipStateTxHash = shipStateUtxo_array[0]?.input.txHash;
                const shipStateTxIndex = shipStateUtxo_array[0]?.input.outputIndex;
                if (shipStateTxHash === undefined || shipStateTxIndex === undefined) {
                    throw new Error("Ship state UTxO not found or missing required transaction information");
                }
                //console.log("shipStateTxHash: ", shipStateTxHash);
                //console.log("shipStateTxIndex: ", shipStateTxIndex);

                const fuelName: string = stringToHex("FUEL")

                if (shipStateUtxo_array.length === 0) {
                    throw new Error(`No UTXOs found containing ship token: ${shipTokenName}`);
                }
                const fuelTokens = shipStateUtxo_array[0]?.output.amount.filter((asset) => asset.unit === `${fuelPolicyId}${fuelName}`)??[];
                const fuel = fuelTokens[0]?.quantity ?? 0;
                console.log("Fuel: ", fuel);
                

                // Construct data for txBuilder
                // Get pilot token utxo from user wallet to send as txIn
                const pilotTokenUtxo = input.utxos.find(
                    (utxo) => utxo.output.amount.some(
                        (asset: { unit: string }) => asset.unit === `${shipyardPolicyId}${stringToHex(pilotTokenName)}`
                    )
                );
                //console.log("pilotTokenUtxo: ", pilotTokenUtxo);
                const pilotTokenTxHash = pilotTokenUtxo.input.txHash;
                const pilotTokenTxIndex = pilotTokenUtxo.input.outputIndex;
               //console.log("pilotTokenTxHash: ", pilotTokenTxHash);
                //console.log("pilotTokenTxIndex: ", pilotTokenTxIndex);

                // Build redeemers: Quit and Burn fuel
                const burnfuelRedeemer = conStr1([]);
               // console.log("burnfuelRedeemer: ", burnfuelRedeemer);

                const burnShipRedeemer = conStr1([]);
               // console.log("burnShipRedeemer: ", burnShipRedeemer);

                const quitRedeemer = conStr(3, []);
                //console.log("quitRedeemer:", quitRedeemer);

                // TxBuilder
                const txBuilder = new MeshTxBuilder({
                    fetcher: maestroProvider,
                    submitter: maestroProvider,
                    verbose: true,
                    evaluator: maestroProvider,
                });

                txBuilder
                    .setNetwork("preprod")

                    .spendingPlutusScriptV3()
                    .txIn(
                        shipStateTxHash,
                        shipStateTxIndex,
                    )
                    .txInRedeemerValue(quitRedeemer,"JSON")
                    .spendingTxInReference(spacetimeRefHashWOUtil, 0)
                    .txInInlineDatumPresent()

                    .txIn(
                        pilotTokenTxHash,
                        pilotTokenTxIndex,
                    )

                    .mintPlutusScriptV3()
                    .mint("-1",shipyardPolicyId!,shipTokenName)
                    .mintTxInReference(spacetimeRefHashWOUtil,0)
                    .mintRedeemerValue(burnShipRedeemer,"JSON")

                    .mintPlutusScriptV3()
                    .mint((-fuel).toString(), fuelPolicyId,stringToHex("FUEL"))
                    .mintTxInReference(pelletRefHashWOUtil, 0)
                    .mintRedeemerValue(burnfuelRedeemer,"JSON")

                    .txOut(input.changeAddress, pilotAsset as Asset[])
                    .txInCollateral(
                        input.collateral.input.txHash,
                        input.collateral.input.outputIndex,
                    )
                    .changeAddress(input.changeAddress)
                    .selectUtxosFrom(input.utxos)
                const unsignedTx = await txBuilder.complete();
                return unsignedTx;
            }
        }),
})