import { z } from "zod";
import { adminTokenPolicy, 
        adminTokenName, 
        fuelTokenPolicy, 
        fuelTokenName,
        pelletRefHash,
        pelletValidatorAddress } from "config";
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

// Admin asset (same for all pellets)
const adminAsset: Asset[] = [
  {
    unit: adminTokenPolicy.bytes + adminTokenName.bytes,
    quantity: "1",
  },
];

const fuelReedemer = conStr0([]);

/* ── temporary in-memory session cache ── */
type Session = { 
                 batches: PelletDatum[][]; 
                 next: number /*pointer*/ 
               };
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
// TODO: add the collateral from the wallet to the .input - DONE
    startDeploy: publicProcedure
    .input(z.object({
      pellets: z.array(PelletRow),
      utxos: z.array(z.any()),        // Mesh wallet UTxOs
      changeAddress: z.string(),
      collateral: z.object({          // Single UTxO object
          input: z.object({
              txHash: z.string(),
              outputIndex: z.number(),
          }),
          output: z.object({
              address: z.string(),
              amount: z.any(),
              datum: z.any().optional(),
          })
      }), 
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

    txBuilder
        .mintPlutusScriptV3()
        .mint(totalFuel.toString(), fuelTokenPolicy.bytes, fuelTokenName.bytes)
        .mintTxInReference(pelletRefHash.fields[0].toString(), Number(pelletRefHash.fields[1])) 
        .mintRedeemerValue(fuelReedemer, "JSON");

      // Add outputs for each pellet in the batch
      firstBatch!.forEach((pellet) => {
        const pelletDatum = conStr0([
          integer(pellet.pos_x),
          integer(pellet.pos_y),
          scriptHash(pellet.shipyard_policy),
        ]);

        const fuelToken: Asset[] = [
          {
            unit: fuelTokenPolicy.bytes + fuelTokenName.bytes,
            quantity: pellet.fuel.toString(),
          },
        ];

        txBuilder
          .txOut(pelletValidatorAddress, fuelToken)
          .txOutInlineDatumValue(pelletDatum, "JSON")
          .txOut(pelletValidatorAddress, adminAsset)
      });

      // Complete the transaction (collateral, change, utxos, network)
      // TODO: How to automatically add collateral from the list of UTXOs?
      txBuilder
        .txInCollateral(
          input.collateral.input.txHash,
          input.collateral.input.outputIndex,
          input.collateral.output.amount,
          input.collateral.output.address
        )
        .changeAddress(input.changeAddress)
        .selectUtxosFrom(input.utxos)
        .setNetwork("preprod")
      const unsignedTx = await txBuilder.complete();

      return { sessionId, unsignedTx };
    }),



    /* 2️⃣  client returns tx hash, asks for next batch */
    // TODO: add the collateral from the wallet to the .input
    nextBatch: publicProcedure
    .input(z.object({
        sessionId: z.string().uuid(),
        lastTxHash: z.string(),
        utxos: z.array(z.any()),
        changeAddress: z.string(),
        collateral: z.object({          // Single UTxO object
          input: z.object({
              txHash: z.string(),
              outputIndex: z.number(),
          }),
          output: z.object({
              address: z.string(),
              amount: z.any(),
              datum: z.any().optional(),
          })
        }),
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

        // Calculate toatlFuel in the current batch (for minting all fuel tokens at once)
        const totalFuel = batch!.reduce((n, p) => n + p.fuel, 0);
        // Assign fuel tokens and datum vales to txOut method for each pellet UTXO by looping through the current batch
        
        // TODO: build first unsignedTx with MeshTxBuilder
        const txBuilder = new MeshTxBuilder({
            fetcher: maestroProvider,
            submitter: maestroProvider,
            verbose: true
        });

        txBuilder
            .mintPlutusScriptV3()
            .mint(totalFuel.toString(), fuelTokenPolicy.bytes, fuelTokenName.bytes)
            .mintTxInReference(pelletRefHash.fields[0].toString(), Number(pelletRefHash.fields[1]))
            .mintRedeemerValue(fuelReedemer, "JSON");

        // Add outputs for each pellet in the batch
        batch!.forEach((pellet) => {
            const pelletDatum = conStr0([
                integer(pellet.pos_x),
                integer(pellet.pos_y),
                scriptHash(pellet.shipyard_policy),
            ]);

            const fuelToken: Asset[] = [
            {
                unit: fuelTokenPolicy.bytes + fuelTokenName.bytes,
                quantity: pellet.fuel.toString(),
            },
            ];

            txBuilder
            .txOut(pelletValidatorAddress, fuelToken)
            .txOutInlineDatumValue(pelletDatum, "JSON")
            .txOut(pelletValidatorAddress, adminAsset)
        });

        // Complete the transaction (collateral, change, utxos, network)
        // TODO: How to automatically add collateral from the list of UTXOs?
        txBuilder
            .txInCollateral(
            input.collateral.input.txHash,
            input.collateral.input.outputIndex,
            input.collateral.output.amount,
            input.collateral.output.address
            )
            .changeAddress(input.changeAddress)
            .selectUtxosFrom(input.utxos)
            .setNetwork("preprod")
        const unsignedTx = await txBuilder.complete();

            return { unsignedTx, done: false as const };
        }),
});
