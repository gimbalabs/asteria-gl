import { asteriaScriptAppliedParam } from "~/lib/mesh-sdk/transactions/admin/apply-param/Asteria";  
import { deployScriptAppliedParam } from "~/lib/mesh-sdk/transactions/admin/apply-param/deploy";
import { pelletScriptApliedParam } from "~/lib/mesh-sdk/transactions/admin/apply-param/pellet";
import { spacetimeScriptAppliedParam } from "~/lib/mesh-sdk/transactions/admin/apply-param/spacetime";

import { Integer, PlutusScript, ScriptHash, serializePlutusScript, resolvePlutusScriptHash} from "@meshsdk/core";
import { deserializeBech32Address, resolvePlutusScriptAddress, deserializePlutusScript } from "@meshsdk/core-csl";



interface DeployParameters {
    adminToken: string, 
    adminTokenName: string, 
    shipMintLovelaceFee: number, 
    maxAsteriaMining: number,  
    maxSpeed: {distance: number, time: number},
    maxShipFuel: number,
    fuelPerStep: number, 
    initialFuel: number, 
    minAsteriaDistance: number,
    pelletScriptHash?: string
    asteriaScriptHash?: string 
}


export async function deployAsteriaValidators({adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining,  maxSpeed, fuelPerStep, initialFuel, maxShipFuel, minAsteriaDistance, pelletScriptHash, asteriaScriptHash}: DeployParameters){

    const deployWithParams = await deployScriptAppliedParam(adminToken, adminTokenName)
    const deployScriptAddress = resolvePlutusScriptAddress(deployWithParams.deployPlutusScript, 0)
   
    const pelletWithParams = await pelletScriptApliedParam(adminToken, adminTokenName)
 
    
    /*const pelletScriptAddress =  pelletScriptAdd!
    const scriptHash = resolvePlutusScriptHash(pelletScriptAddress)
    console.log("script hash:" ,scriptHash)
 
    const pelletScriptHash = deserializeBech32Address(pelletScriptAddress)
    console.log("script hash 2nd:", pelletScriptHash)*/

    
    let asteriaWithParams 

    if(pelletScriptHash){
        asteriaWithParams = asteriaScriptAppliedParam(pelletScriptHash!, adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, minAsteriaDistance, initialFuel )
    }
  

    //const asteriaScriptAddress = resolvePlutusScriptAddress(asteriaWithParams.asteriaPlutusScript, 0)
    //const asteriaScriptHash = deserializeBech32Address(asteriaScriptAddress)
    
    let spaceTimeWithParams 
    if(pelletScriptHash && asteriaScriptHash){
        spaceTimeWithParams = spacetimeScriptAppliedParam(pelletScriptHash!, asteriaScriptHash!, adminToken, adminTokenName, maxSpeed, maxShipFuel, fuelPerStep)

    }
   
    // const spaceTimeAddress = resolvePlutusScriptAddress(spaceTimeWithParams.spacetimePlutusScript, 0)
    //const spaceTimeScriptHash = deserializeBech32Address(spaceTimeAddress)

 

    

    return {deployScriptAddress, deployWithParams, asteriaWithParams, pelletWithParams, spaceTimeWithParams }



}