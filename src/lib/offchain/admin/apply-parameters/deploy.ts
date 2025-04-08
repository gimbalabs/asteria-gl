
import { applyParamsToScript } from "@meshsdk/core-cst";
import plutusBlueprint from "../../../onchain/src/plutus.json" with {type: 'json'}; 

const asteriaValidator = plutusBlueprint.validators.find(
      ({ title }) => title === "deploy.deploy.spend"
    );

const DEPLOY_SCRIPT = asteriaValidator!.compiledCode;

function deployScriptAppliedParam( admin_token:any){
  const appliedDeployParam   = applyParamsToScript(
    DEPLOY_SCRIPT,
    [admin_token],
    "JSON"
    );
  return appliedDeployParam;
  };
export {deployScriptAppliedParam};