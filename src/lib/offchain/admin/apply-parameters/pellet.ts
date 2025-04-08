
import { applyParamsToScript } from "@meshsdk/core-cst";
import plutusBlueprint from "../../../onchain/src/plutus.json" with {type: 'json'};
    
const pelletValidator = plutusBlueprint.validators.find(
  ({ title }) => title === "pellet.pellet.spend"
);
        
const PELLET_SCRIPT = pelletValidator!.compiledCode;

function  pelletScriptApliedParam(admin_token:any){
  const appliedPelletParam   = applyParamsToScript(
    PELLET_SCRIPT,
    [admin_token],
    "JSON",
    );
  return appliedPelletParam;
}
                  
export {pelletScriptApliedParam};