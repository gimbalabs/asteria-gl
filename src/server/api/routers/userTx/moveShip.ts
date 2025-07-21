import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { 
        pelletRefHashWOUtil,  
        spacetimeRefHashWOUtil, 
        fuel_per_step, } from "config";
import {  
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
        resolveSlotNo,
        SLOT_CONFIG_NETWORK,
        unixTimeToEnclosingSlot,
        PlutusScript,
        serializePlutusScript,
        deserializeAddress
        } from "@meshsdk/core";
import {
        fromScriptRef,
        } from "@meshsdk/core-cst";


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
            // TODO: Implement logic to filter UTXO w/ pilot 
            
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
            const pelletAddress = serializePlutusScript(pelletPlutusScript).address


            const pilotAsset = input.filter(
                (asset) => asset.policyId === shipyardPolicyId
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
                const shipStateUtxos_array = await maestroProvider.fetchAddressUTxOs(spacetimeAddress);
                const shipStateUtxo_array = shipStateUtxos_array.filter(
                    (utxo) => utxo.output.amount.some(
                        (asset) => asset.unit === `${shipyardPolicyId}${shipTokenName}`
                    )
                );

                const fuelName: string = stringToHex("FUEL")

                if (shipStateUtxo_array.length === 0) {
                    throw new Error(`No UTXOs found containing ship token: ${shipTokenName}`);
                }
                const fuelTokens = shipStateUtxo_array[0]?.output.amount.filter((asset) => asset.unit === `${fuelPolicyId}${fuelName}`)??[];
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
                // TESTING FOR CONFIG INFO
                // const pelletsScriptUTxo = await maestroProvider.fetchUTxOs("40f99536163547b034a62fbcff2c88e963af1c5dd16186728a87504c084cc1c3");
                // console.log("pelletsScriptUTxo: ", pelletsScriptUTxo);
                // const pelletsFromScriptRef = fromScriptRef(pelletsScriptUTxo[0]!.output.scriptRef!);
                // const pelletsPlutusScript = pelletsFromScriptRef as PlutusScript;
                // const pelletAddress = serializePlutusScript(pelletsPlutusScript).address;
                // console.log("pelletAddress: ", pelletAddress);
                // const pelletPolicyId = deserializeAddress(pelletAddress).scriptHash;
                // console.log("pelletPolicyId: ", pelletPolicyId);

                // const spaceTimeScriptUTxo = await maestroProvider.fetchUTxOs('f1101ab594944f206d90bf16d784acff9f516ff0ba8943bbc0082d36a68a5fde', 0);
                // console.log("spaceTimeScriptUTxo: ", spaceTimeScriptUTxo);
                // const spaceTimeScriptRef = fromScriptRef(spaceTimeScriptUTxo[0]!.output.scriptRef!);
                // console.log("spaceTimeScriptRef: ", spaceTimeScriptRef);
                // const spaceTimePlutusScript = spaceTimeScriptRef as PlutusScript;
                // const spaceTimeAddress = serializePlutusScript(spaceTimePlutusScript).address;
                // console.log("spaceTimeAddress: ", spaceTimeAddress);
                // const spaceTimePolicyId = deserializeAddress(spaceTimeAddress).scriptHash;
                // console.log("spaceTimePolicyId: ", spaceTimePolicyId);

                // END TESTING FOR CONFIG INFO


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
            const pelletAddress = serializePlutusScript(pelletPlutusScript).address


                const { newPosX, newPosY, shipStateDatum, changeAddress, utxos, collateral } = input;
                console.log("newPosX: ", newPosX);
                console.log("newPosY: ", newPosY);
                console.log("collateral: ", collateral);
                const { fuel, coordinateX, coordinateY, shipName, pilotName, posixTime } = shipStateDatum;
                console.log(fuel, coordinateX, coordinateY, shipName, pilotName, posixTime);
                const shipStateUtxos_array = await maestroProvider.fetchAddressUTxOs(spacetimeAddress);
                const shipStateUtxo = shipStateUtxos_array.filter(
                    (utxo) => utxo.output.amount.some(
                        (asset) => asset.unit === `${shipyardPolicyId}${stringToHex(shipName)}`
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
                const deltaX = newPosX - coordinateX;
                const deltaY = newPosY - coordinateY;
                console.log("deltaX:", deltaX, "type:", typeof deltaX);
                console.log("deltaY:", deltaY, "type:", typeof deltaY);
                // Build the spend redeemer
                const moveShipRedeemer = conStr0([
                    integer(deltaX),
                    integer(deltaY),
                ]);
                console.log("moveShipRedeemer: ", moveShipRedeemer);
                // Build the burn fuel redeemer
                const burnfuelRedeemer = conStr1([]);
                console.log("burnfuelRedeemer: ", burnfuelRedeemer);
                // Calculate the fuel tokens in new ship utxo
                const spentFuel = (Math.abs(deltaX) + Math.abs(deltaY)) * Number(fuel_per_step.int);
                console.log("spentFuel: ", spentFuel);
                const newShipFuel = fuel - spentFuel;
                // Construct asset to spacetime validator address
                const assetsToSpacetime: Asset[] = [{
                    unit: shipyardPolicyId + stringToHex(shipName),
                    quantity: "1"
                },{
                    unit: `${fuelPolicyId}${stringToHex("FUEL")}`,
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

                // const tx_latest_slot = resolveSlotNo("preprod", Date.now() + 4 * 60 * 1000);  // Commented out for testing for unixTimeToEnclosingSlot
                // testing resolveSlotNo for the posix time when my ship was created

                // TESTING FOR unixTimeToEnclosingSlot

                const slot_when_ship_was_created = unixTimeToEnclosingSlot(1750740562818, SLOT_CONFIG_NETWORK.preprod);
                console.log("slot_when_ship_was_created: ", slot_when_ship_was_created);

                const tx_latest_slot = unixTimeToEnclosingSlot((Date.now() + 4 * 60 * 1000), SLOT_CONFIG_NETWORK.preprod);
                console.log("tx_latest_slot: ", tx_latest_slot);

                // END TESTING FOR unixTimeToEnclosingSlot

                // // Calculate the new posix time for datum; 86_400 is the zer time slot
                const new_posix_time = (Number(tx_latest_slot) - 86_400) * 1_000 + 1_655_769_600_000;
                // Just check what new_posix_time resoves to in slots
                const new_posix_time_slot = resolveSlotNo("preprod", new_posix_time);
                console.log("new_posix_time_slot: ", new_posix_time_slot);
                console.log("new_posix_time_slot - slot_when_ship_was_created: ", Number(new_posix_time_slot) - Number(slot_when_ship_was_created));
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
                    unit: shipyardPolicyId + stringToHex(pilotName),
                    quantity: "1"
                }];
                console.log("pilotTokenAsset: ", pilotTokenAsset);
                // Get pilot token utxo from user wallet to send as txIn
                const pilotTokenUtxo = utxos.find(
                    (utxo) => utxo.output.amount.some(
                        (asset: { unit: string }) => asset.unit === `${shipyardPolicyId}${stringToHex(pilotName)}`
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

                // Checking what pellet reference hash and idex + space time ref hash and idex show up as when using '.bytes'
                //console.log("pelletRefHash.fields[0].fields[0].bytes: ", pelletRefHash.fields[0].fields[0].bytes);
                //console.log("pelletRefHash.fields[1].int: ", Number(pelletRefHash.fields[1].int));
                //console.log("spacetimeRefHash.fields[0].fields[0].bytes: ", spacetimeRefHash.fields[0].fields[0].bytes);
                //console.log("spacetimeRefHash.fields[1].int: ", Number(spacetimeRefHash.fields[1].int));
                // Build the Tx using TxBuilder
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
                    .txInRedeemerValue(moveShipRedeemer,"JSON")
                    .spendingTxInReference(spacetimeRefHashWOUtil, 0)
                    .txInInlineDatumPresent()

                    .txIn(
                        pilotTokenTxHash,
                        pilotTokenTxIndex,
                    )

                    .mintPlutusScriptV3()
                    .mint((-spentFuel).toString(), fuelPolicyId,stringToHex("FUEL"))
                    .mintTxInReference(pelletRefHashWOUtil, 0)
                    .mintRedeemerValue(burnfuelRedeemer,"JSON")

                    .txOut(spacetimeAddress, assetsToSpacetime)
                    .txOutInlineDatumValue(newShipDatum,"JSON")

                    .txOut(changeAddress, pilotTokenAsset)
                    .invalidBefore(Number(tx_earliest_slot))
                    .invalidHereafter(Number(tx_latest_slot))
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