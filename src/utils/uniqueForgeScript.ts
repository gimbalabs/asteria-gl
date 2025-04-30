// src/utils/uniqueForgeScript.ts
import crypto from "crypto";
import {
  ForgeScript,
  resolvePaymentKeyHash,
  resolveScriptHash,
  type NativeScript,
} from "@meshsdk/core";

/**
 * Build an ANY-sig native script:
 *   sig(realKeyHash)  OR  sig(dummyKeyHash)
 *
 * If `existingDummy` is supplied ➜ reuse it (for re-minting).
 */
export function uniqueForgeScript(
  changeAddressBech32: string,
  existingDummy?: string
) {
  // Mesh helper – no CSL needed
  const realKeyHash = resolvePaymentKeyHash(changeAddressBech32);

  const dummyKeyHash =
    existingDummy ?? crypto.randomBytes(28).toString("hex");

  // Plain-JSON NativeScript recognised by Mesh
  const nativeScript: NativeScript = {
    type: "any",
    scripts: [
      { type: "sig", keyHash: realKeyHash },
      { type: "sig", keyHash: dummyKeyHash },
    ],
  };

  const forgingScript = ForgeScript.fromNativeScript(nativeScript);
  const policyId = resolveScriptHash(forgingScript);

  return { forgingScript, policyId, dummyKeyHash };
}
