import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { spacetimeValidatorAddress } from "config";
import { shipYardPolicy } from "config";
import { UTxO, TxOutRef, TxIn, AssetExtended} from "@meshsdk/core";

export const moveShipRouter = createTRPCRouter({
    queryShipStateDatum: publicProcedure
        .input(z.array(z.object({
            unit: z.string(),
            assetName: z.string(),
            policyId: z.string(),
            assetFingerprint: z.string(),
            quantity: z.string(),
        })))
        .query(async ({ input }) => {
            // TODO: Implement logic to filter UTXO w/ pilot token
            const pilotAsset = input.filter(
                (asset) => asset.policyId === shipYardPolicy
            );
            if (!pilotAsset.length) {
                throw new Error("Ship not minted yet!");
            }
            const pilotTokenName: string = pilotAsset[0]?.assetName ?? "";
            const shipStateUtxos = await maestroProvider.fetchAddressUTxOs(spacetimeValidatorAddress);
            // const shipStateUtxo = shipStateUtxos.filter(
            //     (utxo) => utxo.output.plutusData?.pilot_token_name === pilotTokenName
            // ) // TODO: How to access inline datum when it is an object?
            // if (!shipStateUtxo) {
            //     throw new Error("Ship state UTXO not found");
            // query spacetime validator address for shipState UTXOs 
            // filter them for the specific shipState UTXO based on datum having the same pilot token name
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
