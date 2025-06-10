import { MeshTxBuilder } from "@meshsdk/core";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";

import { deployAsteriaValidators } from "~/lib/offchain/admin/deploy/deployValidators";
import { adminTokenName } from "config";



export const deployAsteriaValidatorsRouter = createTRPCRouter({
    prepareTransaction: publicProcedure
    .input(z.object({ 
      adminToken: z.string(),
      adminTokenName: z.string(),
      shipMintLovelaceFee: z.number(),
      maxAsteriaMining: z.number(),
      maxSpeed:  z.object({distance: z.number(), time: z.number()}),
      fuelPerStep: z.number(),
      initialFuel: z.number(),
      maxShipFuel: z.number(),
      minAsteriaDistance: z.number(),
      changeAddress: z.string(),
      utxos: z.array(z.any()),
    }))
    .mutation( async({input}) => {
     
        const {adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, fuelPerStep, maxSpeed, initialFuel, maxShipFuel, minAsteriaDistance, changeAddress, utxos} = input 


        
        const txBuilder = new MeshTxBuilder({
            fetcher: maestroProvider,
            verbose: true,
          });

        const {
            deployScriptAddress, 
            asteriaWithParams, 
            pelletWithParams, 
            spaceTimeWithParams, 
            asteriaScriptAddress, 
            pelletScriptAddress, 
            spaceTimeAddress} = await deployAsteriaValidators({adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, maxSpeed, fuelPerStep, initialFuel, maxShipFuel, minAsteriaDistance})
        
            console.log("test")
           
          const unsignedTx = await txBuilder
            .txOut(deployScriptAddress, [])
            .txOutReferenceScript(asteriaWithParams.appliedAsteriaParam, "V3")
            .txOut(deployScriptAddress, [])
            .txOutReferenceScript(pelletWithParams.appliedPelletParam, "V3")
            .txOut(deployScriptAddress, [])
            .txOutReferenceScript(spaceTimeWithParams.appliedSpacetimeParam, "V3")
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .setNetwork("preprod")
            .complete()

         

            return {unsignedTx, changeAddress, asteriaScriptAddress,  pelletScriptAddress, spaceTimeAddress  }

    })
})