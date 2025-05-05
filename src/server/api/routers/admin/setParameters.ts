import { createTRPCRouter, publicProcedure } from "../../trpc";
import {z} from "zod"



export const setParametersRouter = createTRPCRouter({
    prepareParameters: publicProcedure
        .input(z.object({
            adminToken: z.string().nonempty(),
            shipFee: z.string().nonempty(),
            maxAsteria: z.string().nonempty(),
            fuelPerStep: z.string().nonempty(), 
            maxSpeed: z.object({
                distance: z.string().nonempty(),
                time: z.string().nonempty()
            }), 
            initialFuel: z.string().nonempty(), 
            minDistance: z.string().nonempty()
        }))
        .mutation(async ({input}) => {
            return {
                success: true
            }
        })

})
