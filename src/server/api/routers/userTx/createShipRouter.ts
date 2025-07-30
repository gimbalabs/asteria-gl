
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";

import { createShip } from "~/lib/offchain/user/transactions/create-ship";


export const createShipRouter = createTRPCRouter({
    prepareCreateShipTx: publicProcedure
    .input(z.object({
        ship_mint_lovelace_fee: z.number(),
        initial_fuel: z.string(),
        posX: z.number(),
        posY: z.number(),
        tx_latest_posix_time: z.number(),
        changeAddress: z.string(),
        utxos: z.array(z.any()),
        collateral: z.any()
        }))
    .mutation(async ({input}) => {
        
        const {ship_mint_lovelace_fee, initial_fuel, posX, posY, tx_latest_posix_time, changeAddress, utxos, collateral} = input


        try{
            const {unsignedTx} = await createShip(
                        ship_mint_lovelace_fee,
                        initial_fuel,
                        posX,
                        posY,
                        tx_latest_posix_time,
                        changeAddress,
                        collateral,
                        utxos,
                    )
     
         
            return {unsignedTx}
            
        } catch(error){
            console.log(error)
        
        }

        

    })
})

