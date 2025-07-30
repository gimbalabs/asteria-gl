import { createTRPCRouter, publicProcedure } from "../../trpc"
import {z} from "zod"

import gatherFuel from "~/lib/offchain/user/transactions/gatherFuel"

export const gatherFuelRouter = createTRPCRouter({
    prepareGatherFuelTx: publicProcedure
    .input(z.object({
        collateralUtxo: z.any(),
        utxos: z.array(z.any()),
        changeAddress: z.string(),
        gatherAmount: z.number(),
        pilotUtxo: z.any(),
        shipUtxo: z.any(),
        pelletUtxo: z.any(),
        spacetimeRefHash: z.string(),
        pelletRefHash: z.string(),
        adminToken: z.object({
            policyId: z.string(),
            name: z.string(),
        })

    }))
    .mutation(async ({input}) => {

        const { collateralUtxo,
        utxos,
        changeAddress,
        gatherAmount,
        pilotUtxo,
        shipUtxo,
        pelletUtxo,
        spacetimeRefHash,
        pelletRefHash,
        adminToken } = input

       
        try {

            const {unsignedTx} = await gatherFuel(collateralUtxo,
        utxos,
        changeAddress,
        gatherAmount,
        pilotUtxo,
        shipUtxo,
        pelletUtxo,
        spacetimeRefHash,
        pelletRefHash,
        adminToken)

   
       

        return {unsignedTx}


        } catch(error){
            console.log(error)
           
        }

    })
    
})