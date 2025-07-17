import { MeshTxBuilder, conStr0} from "@meshsdk/core";
import { maestroProvider } from "~/server/provider/maestroProvider";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { z } from "zod";

import { deployAsteriaValidators } from "~/lib/offchain/admin/deploy/deployValidators";
import { adminTokenName } from "config";
import { hexToString } from "~/utils/hextoString";



export const deployAsteriaValidatorsRouter = createTRPCRouter({
    preparePelletTransaction: publicProcedure
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
            pelletWithParams, 
          } = await deployAsteriaValidators({adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, maxSpeed, fuelPerStep, initialFuel, maxShipFuel, minAsteriaDistance})
        
    
           
          const unsignedTx = await txBuilder
            .txOut(deployScriptAddress, [])
            .txOutInlineDatumValue(conStr0([]),"JSON")
            .txOutReferenceScript(pelletWithParams.appliedPelletParam, "V3")
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .setNetwork("preprod")
            .complete()

         

            return {unsignedTx, changeAddress }

    }),

    prepareAsteriaValidator: publicProcedure.input(
      z.object({ 
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
      pelletHash: z.string()
    })).mutation( async({input}) => {

        const {adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, fuelPerStep, maxSpeed, initialFuel, maxShipFuel, minAsteriaDistance, changeAddress, utxos, pelletHash} = input 


        
        const txBuilder = new MeshTxBuilder({
            fetcher: maestroProvider,
            verbose: true,
          });

        const pelletScriptUtxo = await maestroProvider.fetchUTxOs(pelletHash,0);
        const pelletScriptHash = pelletScriptUtxo[0]!.output.scriptHash;

        const {
            deployScriptAddress, 
            asteriaWithParams,  
          } = await deployAsteriaValidators({adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, maxSpeed, fuelPerStep, initialFuel, maxShipFuel, minAsteriaDistance, pelletScriptHash})
        
        

          const unsignedTx = await txBuilder
            .txOut(deployScriptAddress, [])
            .txOutInlineDatumValue(conStr0([]),"JSON")
            .txOutReferenceScript(asteriaWithParams!.appliedAsteriaParam, "V3")
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .setNetwork("preprod")
            .complete()

         

            return {unsignedTx, changeAddress }

    }),

    prepareSpaceTimeValidator: publicProcedure.input(
      z.object({ 
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
      pelletHash: z.string(),
      asteriaHash: z.string(),
    })).mutation( async({input}) => {

        const {adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, fuelPerStep, maxSpeed, initialFuel, maxShipFuel, minAsteriaDistance, changeAddress, utxos, pelletHash, asteriaHash} = input 


        
        const txBuilder = new MeshTxBuilder({
            fetcher: maestroProvider,
            verbose: true,
          });

        const pelletScriptUtxo = await maestroProvider.fetchUTxOs(pelletHash,0);
        const pelletScriptHash = pelletScriptUtxo[0]!.output.scriptHash;

        const asteriaScriptUtxo = await maestroProvider.fetchUTxOs(asteriaHash, 0)
        const asteriaScriptHash = asteriaScriptUtxo[0]!.output.scriptHash

        const {
            deployScriptAddress, 
            spaceTimeWithParams, 
          } = await deployAsteriaValidators({adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, maxSpeed, fuelPerStep, initialFuel, maxShipFuel, minAsteriaDistance, pelletScriptHash, asteriaScriptHash})
        
          const unsignedTx = await txBuilder
            .txOut(deployScriptAddress, [])
            .txOutInlineDatumValue(conStr0([]),"JSON")
            .txOutReferenceScript(spaceTimeWithParams!.appliedSpacetimeParam, "V3")
            .changeAddress(changeAddress)
            .selectUtxosFrom(utxos)
            .setNetwork("preprod")
            .complete()

         

            return {unsignedTx,  
              spaceTimeWithParams, 
             }

    }),
})