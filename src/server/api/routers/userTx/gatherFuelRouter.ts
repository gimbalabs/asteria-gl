import { createTRPCRouter, publicProcedure } from "../../trpc"


export const gatherFuelRouter = createTRPCRouter({
    prepareGatherFuelTx: publicProcedure
    .input()
    .mutation(async => ({}) => {


    })
    
})