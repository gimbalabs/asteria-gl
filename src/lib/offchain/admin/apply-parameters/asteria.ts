
import { applyParamsToScript } from "@meshsdk/core-cst";
import plutusBlueprint from "../../../onchain/src/plutus.json" with {type: 'json'};
import { Integer} from "@meshsdk/core";
 
const asteriaValidator = plutusBlueprint.validators.find(
    ({ title }) => title === "asteria.asteria.spend"
  );
const ASTERIA_SCRIPT = asteriaValidator!.compiledCode;

function asteriaScriptAppliedParam(
    admin_token:any,
    ship_mint_lovelace_fee:Integer,
    max_asteria_mining: Integer
  ){
const appliedAsteriaParam   = applyParamsToScript(
  ASTERIA_SCRIPT,
    [
      admin_token,
      ship_mint_lovelace_fee,
      max_asteria_mining
    ],
  "JSON"
    );
  return appliedAsteriaParam;
  };

export{asteriaScriptAppliedParam};