// import {
//     pelletScriptAddress,
//     spaceTimeScriptHash,                 // .scriptHash is the policy
//   } from "~/lib/offchain/admin/deploy/deployValidators";
import { z } from "zod";
import { MeshTxBuilder } from "@meshsdk/core";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { maestroProvider } from "~/server/provider/maestroProvider";

export const pelletDeployRouter = createTRPCRouter({
    deploy: publicProcedure
    .input(z.object({

    }))
    .query(async ({ ctx, input }) => {
        
    }),
});