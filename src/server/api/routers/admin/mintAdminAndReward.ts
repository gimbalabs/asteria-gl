import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { MeshTxBuilder, stringToHex } from "@meshsdk/core";
import { uniqueForgeScript } from "~/utils/uniqueForgeScript";
import { maestroProvider } from '../../../provider/maestroProvider';

export const mintAdminAndRewardRouter = createTRPCRouter({
    prepareTransaction: publicProcedure
      .input(z.object({
        tokenName: z.string(),
        quantity: z.string(),
        policyId: z.string().optional(),
        dummyKeyHash: z.string().optional(),
        changeAddress: z.string(), // Frontend must pass user's changeAddress
        utxos: z.array(z.any()),   // Frontend must pass user's UTXOs
      }))
      .mutation(async ({ input }) => {
        const {
            tokenName,
            quantity,
            policyId,
            dummyKeyHash,
            changeAddress,
            utxos, } = input;
        
        let forgingScript;
        let finalPolicyId;
        let finalDummy;
        
       // ── 1. Re-mint under existing policy ─────────────────────
       if (policyId && dummyKeyHash) {
          const rebuilt = uniqueForgeScript(changeAddress, dummyKeyHash);
          forgingScript  = rebuilt.forgingScript;
          finalPolicyId  = policyId;        finalDummy     = dummyKeyHash;

          if (uniqueForgeScript(changeAddress, dummyKeyHash).policyId !== policyId) {
            throw new Error("policyId / dummyKey mismatch with wallet key");
          }

        // ── 2. Brand-new policy ──────────────────────────────────
        } else {
          const fresh = uniqueForgeScript(changeAddress);
          forgingScript  = fresh.forgingScript;
          finalPolicyId  = fresh.policyId;
          finalDummy     = fresh.dummyKeyHash;
        }
  
        const tokenNameHex = stringToHex(tokenName);
  
        const metadata = {
          [finalPolicyId]: {
            [tokenName]: {
              name: tokenName,
              image: "https://i.imghippo.com/files/SKz1188Y.png",
              mediaType: "image/png",
              description: "This NFT was minted through Asteria-GL.",
              dummyKeyHash: finalDummy,
            },
          },
        };
  
        const txBuilder = new MeshTxBuilder({
          fetcher: maestroProvider,
          verbose: true,
        });
  
        const unsignedTx = await txBuilder
          .mint(quantity, finalPolicyId, tokenNameHex)
          .mintingScript(forgingScript)
          .metadataValue(721, metadata)
          .changeAddress(changeAddress)
          .selectUtxosFrom(utxos)
          .complete();
  
        return {unsignedTx, policyId: finalPolicyId, dummyKeyHash: finalDummy}; 
      }),
  });