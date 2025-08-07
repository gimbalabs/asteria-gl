import { createTRPCRouter, publicProcedure } from "../../trpc";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { pelletRefHashWOUtil } from "config";

import { getScriptDetails } from "~/utils/getScriptDetails";
import { TRPCError } from "@trpc/server";


export const getGameStateRouter = createTRPCRouter({
    
    queryPelletState: publicProcedure.query(async () => {

        try{
            const {address} = await getScriptDetails(pelletRefHashWOUtil)
            console.log("address", address)
            const pelletUtxos = await maestroProvider.fetchAddressUTxOs(address)
            console.log(pelletUtxos)
            return {pelletUtxos: pelletUtxos}

        } catch(error){
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Cannot retrieve pellet Utxos" + error
            })
        }
       
       

    })

    // write logic for ship utxos here (need to remove from frontend)

})