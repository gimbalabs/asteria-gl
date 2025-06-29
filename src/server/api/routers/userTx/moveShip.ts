import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { shipYardPolicy, 
        fuelTokenPolicy, 
        fuelTokenName, 
        pelletRefHash,  
        spacetimeRefHash, 
        spacetimeValidatorAddress,
        adminTokenPolicy,
        adminTokenName,
        fuel_per_step, } from "config";
import { UTxO, 
        TxOutRef, 
        TxIn, 
        AssetExtended, 
        stringToHex, 
        hexToString, 
        deserializeDatum, 
        MeshTxBuilder,
        conStr0,
        conStr1,
        integer,
        Asset,
        posixTime as createPosixTime,
        byteString,
        resolveSlotNo
        } from "@meshsdk/core";


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
                const { newPosX, newPosY, shipStateDatum, changeAddress, utxos, collateral } = input;
                const { fuel, coordinateX, coordinateY, shipName, pilotName, posixTime } = shipStateDatum;
                console.log(fuel, coordinateX, coordinateY, shipName, pilotName, posixTime);
                const shipStateUtxos_array = await maestroProvider.fetchAddressUTxOs(spacetimeValidatorAddress);
                const shipStateUtxo = shipStateUtxos_array.filter(
                    (utxo) => utxo.output.amount.some(
                        (asset) => asset.unit === `${shipYardPolicy}${stringToHex(shipName)}`
                    )
                )[0];
                console.log("shipStateUtxo: ", shipStateUtxo);
                const shipStateTxHash = shipStateUtxo?.input.txHash;
                const shipStateTxIndex = shipStateUtxo?.input.outputIndex;
                if (!shipStateTxHash || !shipStateTxIndex) {
                    throw new Error("Ship state UTxO not found or missing required transaction information");
                }
                console.log("shipStateTxHash: ", shipStateTxHash);
                console.log("shipStateTxIndex: ", shipStateTxIndex);

                // Calculate deltaX and deltaY
                const deltaX = Math.abs(newPosX - coordinateX);
                const deltaY = Math.abs(newPosY - coordinateY);
                console.log("deltaX:", deltaX, "type:", typeof deltaX);
                console.log("deltaY:", deltaY, "type:", typeof deltaY);
                // Build the spend redeemer
                const moveShipRedeemer = conStr0([
                    integer(deltaX),
                    integer(deltaY)
                ]);
                // Build the burn fuel redeemer
                const burnfuelRedeemer = conStr1([]);
                // Calculate the fuel tokens in new ship utxo
                const spentFuel = (deltaX + deltaY) * Number(fuel_per_step.int);
                console.log("spentFuel: ", spentFuel);
                const newShipFuel = fuel - spentFuel;
                // Construct asset to spacetime validator address
                const assetsToSpacetime: Asset[] = [{
                    unit: shipYardPolicy + stringToHex(shipName),
                    quantity: "1"
                },{
                    unit: `${fuelTokenPolicy.bytes}${fuelTokenName.bytes}`,
                    quantity: newShipFuel.toString()
                }];
                console.log("assetsToSpacetime: ", assetsToSpacetime);

                // Setting up the lower and upper bound time for the tx
                const response = await fetch('https://preprod.gomaestro-api.org/v1/chain-tip', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'api-key': process.env.MAESTRO_PREPROD_KEY || ''  // Assuming MAESTRO_API_KEY is in your .env
                    }
                  });
                const curret_blockchain_time_json = await response.json();
                console.log("curret_blockchain_time_json: ", curret_blockchain_time_json);
                const current_blockchain_time_slot = curret_blockchain_time_json.data.slot;
                console.log("current_blockchain_time_slot: ", current_blockchain_time_slot);
                // What we need for the tx
                const tx_earliest_slot = current_blockchain_time_slot;
                const tx_latest_slot = tx_earliest_slot + 4 * 60;
                // // Calculate the new posix time for datum
                const new_posix_time = tx_latest_slot * 1000 + 1654041600000;
                console.log("new_posix_time: ", new_posix_time);
                console.log("tx_earliest_slot: ", tx_earliest_slot);
                console.log("tx_latest_slot: ", tx_latest_slot);

                // Construct the new datum for the new shipState UTXO
                const newShipDatum = conStr0([
                    integer(newPosX),
                    integer(newPosY),
                    byteString(stringToHex(shipName)),
                    byteString(stringToHex(pilotName)),
                    createPosixTime(new_posix_time)
                ]);
                console.log("newShipDatum: ", newShipDatum);

                // Construct the pilot token asset
                const pilotTokenAsset: Asset[] = [{
                    unit: shipYardPolicy + stringToHex(pilotName),
                    quantity: "1"
                }];
                console.log("pilotTokenAsset: ", pilotTokenAsset);
                // Get pilot token utxo from user wallet to send as txIn
                const pilotTokenUtxo = utxos.find(
                    (utxo) => utxo.output.amount.some(
                        (asset: { unit: string }) => asset.unit === `${shipYardPolicy}${stringToHex(pilotName)}`
                    )
                );
                console.log("pilotTokenUtxo: ", pilotTokenUtxo);
                if (!pilotTokenUtxo) {
                    throw new Error("Pilot token UTxO not found");
                }
                const pilotTokenTxHash = pilotTokenUtxo.input.txHash;
                const pilotTokenTxIndex = pilotTokenUtxo.input.outputIndex;
                console.log("pilotTokenTxHash: ", pilotTokenTxHash);
                console.log("pilotTokenTxIndex: ", pilotTokenTxIndex);


                // Build the Tx using TxBuilder
                const txBuilder = new MeshTxBuilder({
                    fetcher: maestroProvider,
                    submitter: maestroProvider,
                    verbose: true
                });

                txBuilder
                    .setNetwork("preprod")

                    .spendingPlutusScriptV3()
                    .txIn(
                        shipStateTxHash,
                        shipStateTxIndex,
                    )
                    .txInRedeemerValue(moveShipRedeemer,"JSON")
                    .spendingTxInReference(spacetimeRefHash.fields[0].fields[0].bytes, Number(spacetimeRefHash.fields[1].int))
                    .txInInlineDatumPresent()
                    .txOut(spacetimeValidatorAddress, assetsToSpacetime)
                    .txOutInlineDatumValue(newShipDatum,"JSON")

                    .txIn(
                        pilotTokenTxHash,
                        pilotTokenTxIndex,
                    )

                    .mintPlutusScriptV3()
                    .mint((-spentFuel).toString(), fuelTokenPolicy.bytes, fuelTokenName.bytes)
                    .mintTxInReference(pelletRefHash.fields[0].fields[0].bytes, Number(pelletRefHash.fields[1].int))
                    .mintRedeemerValue(burnfuelRedeemer,"JSON")

                    .txOut(changeAddress, pilotTokenAsset)
                    .invalidBefore(tx_earliest_slot)
                    .invalidHereafter(tx_latest_slot)
                    .txInCollateral(
                        collateral.input.txHash,
                        collateral.input.outputIndex,
                    )
                    .changeAddress(changeAddress)
                    .selectUtxosFrom(utxos)
                const unsignedTx = await txBuilder.complete();
                return unsignedTx;
            })
})

