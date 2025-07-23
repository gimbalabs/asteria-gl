import { createTRPCRouter, publicProcedure } from "../../trpc"
import {z} from "zod"
import { deserializeRefHash } from "~/lib/utils/deserializeRefHash"
import { spacetimeRefHashWOUtil } from "config"
import { hexToString, stringToHex } from "@meshsdk/core"
import { maestroProvider } from "~/server/provider/maestroProvider"
import { UTxO } from "@meshsdk/core"


export const mineAsteriaRouter = createTRPCRouter({
    prepareMineAsteriaTx: publicProcedure
    .input(z.object({
        collateralUtxo: z.any(),
        pilotUtxo: z.object({          // Single UTxO object
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
        utxos: z.array(z.any()),
        changeAddress: z.string()
    }))
    .mutation( async ({input}) => {

        const {scriptAddress: spacetimeAddress, policyId: shipyardPolicy} = await deserializeRefHash(spacetimeRefHashWOUtil)
        
        const pilotUtxo: UTxO = input.pilotUtxo

         const pilotAsset= pilotUtxo.output.amount.filter(
                (asset) => asset.unit.startsWith(shipyardPolicy!)  // easier to split string here
            );

        const pilotTokenName: string = hexToString(pilotAsset[0]?.assetName ?? "");
        
        console.log(pilotTokenName);
        /// Extract the number from pilot token: eg. PILOT13 (gets "13")
        const pilotNumber = pilotTokenName.replace("PILOT", "");
                // Create ship token name by adding "SHIP" prefix (makes "SHIP13")
        const shipTokenName = stringToHex(`SHIP${pilotNumber}`);
        const shipStateUtxos_array = await maestroProvider.fetchAddressUTxOs(spacetimeAddress);
        const shipStateUtxo_array = shipStateUtxos_array.filter(
            (utxo) => utxo.output.amount.some(
                (asset) => asset.unit === `${shipyardPolicy}${shipTokenName}`
            )
        );

    })

})