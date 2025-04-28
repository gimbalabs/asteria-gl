import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { MeshTxBuilder, ForgeScript, resolveScriptHash, stringToHex } from '@meshsdk/core';
import { maestroProvider } from '../../../provider/maestroProvider';

export const mintAdminAndRewardRouter = createTRPCRouter({
    prepareTransaction: publicProcedure
      .input(z.object({
        tokenName: z.string(),
        quantity: z.string(),
        policyId: z.string().optional(),
        changeAddress: z.string(), // Frontend must pass user's changeAddress
        utxos: z.array(z.any()),   // Frontend must pass user's UTXOs
      }))
      .mutation(async ({ input }) => {
        const { tokenName, quantity, policyId, changeAddress, utxos } = input;
  
        const forgingScript = ForgeScript.withOneSignature(changeAddress);
        const finalPolicyId = policyId || resolveScriptHash(forgingScript);
  
        const tokenNameHex = stringToHex(tokenName);
  
        const metadata = {
          [finalPolicyId]: {
            [tokenName]: {
              name: tokenName,
              image: "https://i.imghippo.com/files/SKz1188Y.png",
              mediaType: "image/png",
              description: "This NFT was minted through Asteria-GL.",
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
  
        return unsignedTx; // Send back unsigned tx to frontend
      }),
  });