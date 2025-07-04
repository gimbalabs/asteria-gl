
import { applyParamsToScript} from "@meshsdk/core-cst";
import  plutusBlueprint from "../../../../onchain/src/plutus.json" with {type: 'json'};
import { integer, PlutusScript, scriptHash, policyId, conStr0, byteString, stringToHex, assetName} from "@meshsdk/core";

const asteriaValidator = plutusBlueprint.validators.find(
        ({ title }) => title === "spacetime.spacetime.spend"
    );

const SPACETIME_SCRIPT = asteriaValidator!.compiledCode;

function spacetimeScriptAppliedParam (
   pelletScriptAddress: string,
   asteriaScriptAddress: string,
   admin_token: string,
   adminTokenName: string,
   max_speed: {distance: number, time: number},
   max_ship_fuel: number,
   fuel_per_step: number,

){
    console.log(pelletScriptAddress, asteriaScriptAddress, admin_token, adminTokenName, max_speed.distance, max_speed.time, max_ship_fuel, fuel_per_step)
    
    const AdminTokenData =  conStr0([
        policyId(admin_token), 
        assetName(stringToHex(adminTokenName))                              
      ]);

    const maxSpeed = conStr0([
        integer(max_speed.distance),
        integer(max_speed.time)
    ])


    const appliedSpacetimeParam = applyParamsToScript(
        SPACETIME_SCRIPT,
        [   scriptHash(pelletScriptAddress),
            scriptHash(asteriaScriptAddress),
            AdminTokenData,
            maxSpeed,
            integer(max_ship_fuel),
            integer(fuel_per_step)
        ],
        "JSON"
        );

    const spacetimePlutusScript: PlutusScript = {
        code: appliedSpacetimeParam,
        version: "V3"
    };
    return {spacetimePlutusScript,appliedSpacetimeParam};
};

export {spacetimeScriptAppliedParam};