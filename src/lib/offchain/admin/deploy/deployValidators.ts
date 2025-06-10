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
    minAsteriaDistance: number
}


export async function deployAsteriaValidators({adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining,  maxSpeed, fuelPerStep, initialFuel, maxShipFuel, minAsteriaDistance}: DeployParameters){

    const pelletWithParams = pelletScriptApliedParam(adminToken, adminTokenName)
 
    
    const pelletScriptAddress =  resolvePlutusScriptAddress(pelletWithParams.pelletPlutusScript, 0)
    const scriptHash = resolvePlutusScriptHash(pelletScriptAddress)
    console.log("script hash:" ,scriptHash)
 
    const pelletScriptHash = deserializeBech32Address(pelletScriptAddress)
    console.log("script hash 2nd:", pelletScriptHash)

    
    const asteriaWithParams = await asteriaScriptAppliedParam(pelletScriptAddress, adminToken, adminTokenName, shipMintLovelaceFee, maxAsteriaMining, minAsteriaDistance, initialFuel )

    const deployWithParams = await deployScriptAppliedParam(adminToken, adminTokenName)
  

    const asteriaScriptAddress = resolvePlutusScriptAddress(asteriaWithParams.asteriaPlutusScript, 0)
    const asteriaScriptHash = deserializeBech32Address(asteriaScriptAddress)
    
    const spaceTimeWithParams = spacetimeScriptAppliedParam(pelletScriptHash.scriptHash, asteriaScriptHash.scriptHash, adminToken, adminTokenName, maxSpeed, maxShipFuel, fuelPerStep)
    const spaceTimeAddress = resolvePlutusScriptAddress(spaceTimeWithParams.spacetimePlutusScript, 0)
    const spaceTimeScriptHash = deserializeBech32Address(spaceTimeAddress)

    console.log(spaceTimeAddress)

    const deployScriptAddress = resolvePlutusScriptAddress(deployWithParams.deployPlutusScript, 0)

    return {deployScriptAddress, deployWithParams, asteriaWithParams, pelletWithParams, spaceTimeWithParams, asteriaScriptAddress, pelletScriptAddress, spaceTimeAddress, asteriaScriptHash, pelletScriptHash, spaceTimeScriptHash }



}