import { createTRPCRouter, publicProcedure } from "../../trpc"
import {z} from "zod"
import { deserializeRefHash } from "~/lib/utils/deserializeRefHash"
import { spacetimeRefHashWOUtil } from "config"
import { hexToString, stringToHex } from "@meshsdk/core"
import { maestroProvider } from "~/server/provider/maestroProvider"
import { UTxO } from "@meshsdk/core"
import { mineAsteria } from "~/lib/offchain/user/transactions/mineAsteria"


export const mineAsteriaRouter = createTRPCRouter({
    prepareMineAsteriaTx: publicProcedure
    .input(z.object({
        collateralUtxo: z.any(),
        pilotUtxo: z.any(),
        pilotNumber: z.string(),
        utxos: z.array(z.any()),
        changeAddress: z.string()
    }))
    .mutation( async ({input}) => {

        const {scriptAddress: spacetimeAddress, policyId: shipyardPolicy} = await deserializeRefHash(spacetimeRefHashWOUtil)
        
        console.log(input.pilotNumber);
        /// Extract the number from pilot token: eg. PILOT13 (gets "13")
      
                // Create ship token name by adding "SHIP" prefix (makes "SHIP13")
        const shipTokenName = stringToHex(`SHIP${input.pilotNumber}`);
        const shipStateUtxos_array = await maestroProvider.fetchAddressUTxOs(spacetimeAddress);
        const shipStateUtxo: UTxO[] = shipStateUtxos_array.filter(
            (utxo) => utxo.output.amount.some(
                (asset) => asset.unit === `${shipyardPolicy}${shipTokenName}`
            )
        );
        console.log("shipState utxo:" , shipStateUtxo)

        const {unsignedTx, error, asteriaMined} = await mineAsteria(shipStateUtxo[0]!, input.collateralUtxo, input.pilotUtxo, input.changeAddress, input.utxos)

        if (error){
            return {error: error}
        }

        return {unsignedTx, asteriaMined}


    })

})