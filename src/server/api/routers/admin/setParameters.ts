import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// 1) Define a base “parameter shape” that matches your JSON fields
const ParameterShape = z.object({
  adminToken:           z.string().regex(/^[0-9a-fA-F]+$/),
  adminTokenName:       z.string().nonempty(),
  shipMintLovelaceFee:  z.coerce.number().int().positive(),
  maxAsteriaMining:     z.coerce.number().int().positive(),
  maxSpeed: z.object({
    distance: z.coerce.number().int().positive(),
    timeMs:   z.coerce.number().int().positive(),
  }),
  maxShipFuel:          z.coerce.number().int().positive(),
  fuelPerStep:          z.coerce.number().int().positive(),
  initialFuel:          z.coerce.number().int().nonnegative(),
  minAsteriaDistance:   z.coerce.number().int().positive(),
});

// 2) Input schema is exactly that base shape
const SetParametersInput = ParameterShape;

// 3) Output schema takes the same shape + adds your other columns
const GetParametersOutput = ParameterShape
  .extend({
    id:        z.number(),
    updatedAt: z.date(),
  })
  // it can be null if no row exists
  .nullable();

export const setParametersRouter = createTRPCRouter({
  // READ
  getParameters: publicProcedure
    .output(GetParametersOutput)      // ← here’s your output validator
    .query(async ({ ctx }) => {
      const raw = await ctx.db.gameParameters.findUnique({
        where: { id: 1 },
      });
      // parse will throw if raw doesn’t match your shape
      return raw ? GetParametersOutput.parse(raw) : null;
    }),

  // UPDATE / INSERT
  setParameters: publicProcedure
    .input(SetParametersInput)        // ← here’s your input validator
    .mutation(({ ctx, input }) =>
      ctx.db.gameParameters.upsert({
        where:  { id: 1 },
        update: input,
        create: { id: 1, ...input },
      })
    ),
});
