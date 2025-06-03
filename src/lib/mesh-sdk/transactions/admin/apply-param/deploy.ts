
import { applyParamsToScript } from "@meshsdk/core-cst";
import plutusBlueprint from "../../../../onchain/src/plutus.json" with {type: 'json'}; 
import { PlutusScript } from "@meshsdk/core";

import { policyId, byteString, conStr0, stringToHex } from "@meshsdk/core";

const asteriaValidator = plutusBlueprint.validators.find(
        ({ title }) => title === "deploy.deploy.spend"
  );

const DEPLOY_SCRIPT = asteriaValidator!.compiledCode;



function deployScriptAppliedParam( admin_token: string, adminTokenName: string){

  const AdminTokenData =  conStr0([
    policyId(admin_token), 
    byteString(stringToHex(adminTokenName))                              
  ]);

  const appliedDeployParam   = applyParamsToScript(
      DEPLOY_SCRIPT,
      [AdminTokenData],
      "JSON"
    );

  const deployPlutusScript : PlutusScript = {
    code: appliedDeployParam,
    version: "V3"
  };
return {deployPlutusScript,appliedDeployParam};
};

export {deployScriptAppliedParam};