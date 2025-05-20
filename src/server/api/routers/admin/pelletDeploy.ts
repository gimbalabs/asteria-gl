// .input procedure to accept and validate the shape of the pellet array of ojbects
// .mutate to create the tx
// similar to mintAdminAndRewards 


// import {
//     pelletScriptAddress,
//     spaceTimeScriptHash,                 // .scriptHash is the policy
//   } from "~/lib/offchain/admin/deploy/deployValidators";
import { z } from "zod";
import { MeshTxBuilder } from "@meshsdk/core";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { PelletParams} from "~/utils/pelletUtils";

export const pelletDeployRouter = createTRPCRouter({
    deploy: publicProcedure
    .input(z.object({
        pellets: z.array(z.object({
            fuel: z.number(),
            pos_x: z.number(),
            pos_y: z.number(),
            shipyard_policy: z.string()
        }))
    }))
    .mutation(async ({ ctx, input }) => {
        
        
    }),
});