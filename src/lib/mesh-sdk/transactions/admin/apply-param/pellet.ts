
import { applyParamsToScript } from "@meshsdk/core-cst";
import plutusBlueprint from "../../../../onchain/src/plutus.json" with {type: 'json'};
import { PlutusScript } from "@meshsdk/core";

import { policyId, byteString, conStr0, stringToHex } from "@meshsdk/core";


    
const pelletValidator = plutusBlueprint.validators.find(
    ({ title }) => title === "pellet.pellet.spend"
  );
        
const PELLET_SCRIPT = pelletValidator!.compiledCode;

function  pelletScriptApliedParam(admin_token: string, adminTokenName: string){

  const AdminTokenData =  conStr0([
    policyId(admin_token), 
    byteString(stringToHex(adminTokenName))                              
  ]);
  
  const appliedPelletParam   = applyParamsToScript(
    PELLET_SCRIPT,
    [AdminTokenData],
    "JSON",
    );

  const pelletPlutusScript: PlutusScript = {
    code: appliedPelletParam,
    version: "V3"
    };
  return {pelletPlutusScript, appliedPelletParam};
};
                      
export {pelletScriptApliedParam};