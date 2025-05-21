// .input procedure to accept and validate the shape of the pellet array of ojbects
// .mutate btaches the pellets in size of 7 and sends one btach at a time to frontend for signing
// Front end sends back tx hash for submitted tx and backend sends in the next batch of 7 pellets for signing
// This continues until all pellets are deployed


// import {
//     pelletScriptAddress,
//     spaceTimeScriptHash,                 // .scriptHash is the policy
//   } from "~/lib/offchain/admin/deploy/deployValidators";
import { z } from "zod";
import {
    Asset,
    conStr0,
    integer,
    MeshTxBuilder,
    PlutusScript,
    scriptHash,
    stringToHex,
    UTxO
  } from "@meshsdk/core";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { randomUUID } from "crypto";
import { chunk } from "lodash";
import { PelletDatum } from "~/types/pellet";

const fueltokenNameHex = stringToHex("FUEL"); 

/* ── temporary in-memory session cache ── */
type Session = { batches: PelletDatum[][]; next: number /*pointer*/ };
const sessions = new Map<string, Session>();

/* ── single row validator ── */
const PelletRow = z.object({
    fuel: z.number().int().positive(),
    pos_x: z.number().int(),
    pos_y: z.number().int(),
    shipyard_policy: z.string().regex(/^[0-9a-f]{56}$/i),
  }); 

export const pelletDeployRouter = createTRPCRouter({
/* 1️⃣  user sends all pellets + wallet context once */
    startDeploy: publicProcedure
    .input(z.object({
      pellets: z.array(PelletRow),
      utxos: z.array(z.any()),        // Mesh wallet UTxOs
      changeAddress: z.string(),
    }))
    .mutation(async ({ input }) => {
      // const deployCtx = await ctx.db.deployContext.findFirstOrThrow();
      const sessionId = randomUUID();
      sessions.set(sessionId, {
        batches: chunk(input.pellets, 7),
        next: 0,
      });

      // Calculate toatlFuel in the first chunk/batch (for minting all fuel tokens at once)
      // Get the first batch (at index 0)
     const firstBatch = sessions.get(sessionId)!.batches[0];
     const totalFuel = firstBatch!.reduce((n, p) => n + p.fuel, 0);
      // Assign fuel tokens and datum vales to txOut method for each pellet UTXO by looping through the first chunk/batch
      
     // TODO: build first unsignedTx with MeshTxBuilder
     const txBuilder = new MeshTxBuilder({
        fetcher: maestroProvider,
        submitter: maestroProvider,
        verbose: true
      });




     const unsignedTx = "cbor_hex_placeholder";
 
     return { sessionId, unsignedTx };   // done: false implied
     }),

    /* 2️⃣  client returns tx hash, asks for next batch */
    nextBatch: publicProcedure
    .input(z.object({
        sessionId: z.string().uuid(),
        lastTxHash: z.string(),
        utxos: z.array(z.any()),
        changeAddress: z.string(),
    }))
    .mutation(async ({ input }) => {
        const session = sessions.get(input.sessionId);
        if (!session) throw new Error("invalid session");

        session.next += 1;
        const batch = session.batches[session.next];

        if (!batch) {
        sessions.delete(input.sessionId);
        return { done: true as const };
        }

        // TODO: build unsignedTx for this batch
        const unsignedTx = `cbor_hex_placeholder_${session.next}`;

        return { unsignedTx, done: false as const };
    }),
});
