import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const setParametersRouter = createTRPCRouter({
  /** 1.  READ the singleton row ------------------------------------ */
  getParameters: publicProcedure.query(({ ctx }) =>
    ctx.db.gameParameters.findUnique({ where: { id: 1 } })
  ),

  /** 2.  UPDATE or insert the singleton row ------------------------ */
  setParameters: publicProcedure
    .input(
      z.object({
        adminToken: z.string().length(56).regex(/^[0-9a-fA-F]+$/),
        adminTokenName: z.string().nonempty(),
        shipMintLovelaceFee: z.coerce.number().int().positive(),
        maxAsteriaMining:    z.coerce.number().int().positive(),
        maxSpeed: z.object({
          distance: z.coerce.number().int().positive(),
          timeMs:   z.coerce.number().int().positive(),
        }),
        maxShipFuel: z.coerce.number().int().positive(),
        fuelPerStep: z.coerce.number().int().positive(),
        initialFuel: z.coerce.number().int().nonnegative(),
        minAsteriaDistance: z.coerce.number().int().positive(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.gameParameters.upsert({  // upsert means update or create
        where:  { id: 1 },      // if you find id === 1
        update: input,         // update the row with the input
        create: { id: 1, ...input }, // if not, create the row 
      })
    ),
});
