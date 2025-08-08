import { createTRPCRouter, publicProcedure } from "../../trpc";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { pelletRefHashWOUtil, spacetimeRefHashWOUtil } from "config";

import { getScriptDetails } from "~/utils/getScriptDetails";
import { TRPCError } from "@trpc/server";


export const getGameStateRouter = createTRPCRouter({
    
    queryPelletState: publicProcedure.query(async () => {

        try{
            const {address} = await getScriptDetails(pelletRefHashWOUtil)
           
            const pelletUtxos = await maestroProvider.fetchAddressUTxOs(address)
          
            return {pelletUtxos: pelletUtxos}

        } catch(error){
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Cannot retrieve pellet Utxos" + error
            })
        }
       
       

    }),

    queryShipState: publicProcedure.query(async () => {

        try{
            const{address} = await getScriptDetails(spacetimeRefHashWOUtil)
            const shipUtxos = await maestroProvider.fetchAddressUTxOs(address)
            return {shipUtxos: shipUtxos}
        } catch(error) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Failed to retrieve Ship Utxos" + error
            })
        }
    })

    // write logic for ship utxos here (need to remove from frontend)

})