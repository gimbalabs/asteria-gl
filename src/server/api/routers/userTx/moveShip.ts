import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { spacetimeValidatorAddress } from "config";
import { shipYardPolicy, fuelTokenPolicy, fuelTokenName } from "config";
import { UTxO, TxOutRef, TxIn, AssetExtended, stringToHex, hexToString, deserializeDatum} from "@meshsdk/core";


export const moveShipRouter = createTRPCRouter({
    queryShipStateDatum: publicProcedure
        .input(z.array(z.object({
            unit: z.string(),
            policyId: z.string(),
            assetName: z.string(),
            fingerprint: z.string(),
            quantity: z.string(),
        })))
        .output(z.object({
                fuel: z.number(),
                coordinateX: z.number(),
                coordinateY: z.number(),
                shipName: z.string(),
                pilotName: z.string(),
                posixTime: z.number(),
        }))
        .mutation(async ({ input }) => {
            // TODO: Implement logic to filter UTXO w/ pilot token
            const pilotAsset = input.filter(
                (asset) => asset.policyId === shipYardPolicy
            );
            if (!pilotAsset.length) {
                throw new Error("Ship not minted yet!");
            }else if (pilotAsset.length > 1) {
                throw new Error("Multiple ships minted! Try sending the extra PILOT tokens to a different address.");
            }else {
                const pilotTokenName: string = hexToString(pilotAsset[0]?.assetName ?? "");
                console.log(pilotTokenName);
                /// Extract the number from pilot token: eg. PILOT13 (gets "13")
                const pilotNumber = pilotTokenName.replace("PILOT", "");
                // Create ship token name by adding "SHIP" prefix (makes "SHIP13")
                const shipTokenName = stringToHex(`SHIP${pilotNumber}`);
                const shipStateUtxos_array = await maestroProvider.fetchAddressUTxOs(spacetimeValidatorAddress);
                const shipStateUtxo_array = shipStateUtxos_array.filter(
                    (utxo) => utxo.output.amount.some(
                        (asset) => asset.unit === `${shipYardPolicy}${shipTokenName}`
                    )
                );

                if (shipStateUtxo_array.length === 0) {
                    throw new Error(`No UTXOs found containing ship token: ${shipTokenName}`);
                }
                const fuelTokens = shipStateUtxo_array[0]?.output.amount.filter((asset) => asset.unit === `${fuelTokenPolicy.bytes}${fuelTokenName.bytes}`)??[];
                const fuel = fuelTokens[0]?.quantity ?? 0;
                console.log("Fuel: ", fuel);
                const shipStateDatum_plutusData = shipStateUtxo_array[0]?.output.plutusData;
                if (!shipStateDatum_plutusData) {
                    throw new Error(`No datum found for ship token: ${shipTokenName}`);
                }

                const shipStateDatum_constr = deserializeDatum(shipStateDatum_plutusData);
                console.log(shipStateDatum_constr);
                const shipStateDatum = {
                    fuel: Number(fuel),
                    coordinateX: Number(shipStateDatum_constr.fields[0].int),
                    coordinateY: Number(shipStateDatum_constr.fields[1].int),
                    shipName: hexToString(shipStateDatum_constr.fields[2].bytes),
                    pilotName: hexToString(shipStateDatum_constr.fields[3].bytes),
                    posixTime: Number(shipStateDatum_constr.fields[4].int),
                };
                console.log(shipStateDatum);
                return shipStateDatum;
            }           
        }),

        moveShip: publicProcedure
            .input(z.object({
                newPosX: z.number(),
                newPosY: z.number(),
                shipStateDatum: z.object({
                    fuel: z.number(),
                    coordinateX: z.number(),
                    coordinateY: z.number(),
                    shipName: z.string(),
                    pilotName: z.string(),
                    posixTime: z.number(),
                }),
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
                }),
            }))
            .mutation(async ({ input }) => {
                const { newPosX, newPosY, shipStateDatum, changeAddress, utxos } = input;
                console.log("newPosX: ", newPosX);
                console.log("newPosY: ", newPosY);
                console.log("shipStateDatum: ", shipStateDatum);
                console.log("changeAddress: ", changeAddress);
                const { fuel, coordinateX, coordinateY, shipName, pilotName, posixTime } = shipStateDatum;
                console.log(fuel, coordinateX, coordinateY, shipName, pilotName, posixTime);
                const { txId, txIndex } = utxos[0];
                console.log("txId: ", txId);
                console.log("txIndex: ", txIndex);
                // const txBuilder = new MeshTxBuilder({
                //     fetcher: maestroProvider,
                //     submitter: maestroProvider,
                //     verbose: true
                // });
            })
})



// Receive UTXOs,collateral, coordinates to move the ship from the user/frontend
// Note: The frontend checks if the coordinates are in range based on fuel available
// Filter/check for the UTXO with pilot token
// If not available, return error/message
// If available move to next steps below:
// Query/Index the corresponding shipState UTXO from the spacetime validator address
// In the shipState UTXO, we need TXId, TxIndex, datum, and tokens
// Calculate deltax and delta y
// Construct the redeemer w/ change in x and y (deltax and delta y)
// Construct the new datum for the new shipState UTXO
// Calculate the upper and lower bounds of the new tx_latest_posix_time based on deltax and delta y
// If the new tx_latest_posix_time is out of bounds, return error/message
// If the new tx_latest_posix_time is within bounds, move to next step:
// Build the Tx using TxBuilder
// Send the unsignedTx to the frontend to sign and submit

// Note: Think some more about the latest_posix_time and the bounds
