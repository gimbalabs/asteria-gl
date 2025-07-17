
import { applyParamsToScript } from "@meshsdk/core-cst";
import plutusBlueprint from "../../../../onchain/src/plutus.json" with {type: 'json'};
import { Integer, PlutusScript, integer, policyId ,byteString, conStr0, stringToHex, scriptHash, deserializeAddress, assetName}  from "@meshsdk/core";

 
const asteriaValidator = plutusBlueprint.validators.find(
        ({ title }) => title === "asteria.asteria.spend"
  );  
const ASTERIA_SCRIPT = asteriaValidator!.compiledCode;

function asteriaScriptAppliedParam(
  pelletScriptHash: string,
  admin_token: string,
  adminTokenName: string,
  ship_mint_lovelace_fee: number,
  max_asteria_mining: number,
  min_asteria_distance: number,
  initial_fuel: number,

  ){

  console.log(pelletScriptHash, admin_token, adminTokenName, ship_mint_lovelace_fee, max_asteria_mining, min_asteria_distance, initial_fuel)

  const AdminTokenData =  conStr0([
      policyId(admin_token), 
      assetName(stringToHex(adminTokenName))                              
    ]);

  //const pelletAddress = deserializeAddress(pellet_address)

  const appliedAsteriaParam   = applyParamsToScript(
     ASTERIA_SCRIPT,
      [
        scriptHash(pelletScriptHash),
        AdminTokenData,
        integer(ship_mint_lovelace_fee),
        integer(max_asteria_mining),
        integer(min_asteria_distance),
        integer(initial_fuel),
      ],
      "JSON"
      );

    const asteriaPlutusScript: PlutusScript = {
      code: appliedAsteriaParam,
      version: "V3"
    };

  return { asteriaPlutusScript, appliedAsteriaParam};
};

export{asteriaScriptAppliedParam};