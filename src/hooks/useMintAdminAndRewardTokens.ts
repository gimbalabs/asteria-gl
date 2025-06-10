import { useState } from "react";
import { api } from "~/utils/api";
import { useWallet } from "@meshsdk/react"; // 👈 import useWallet from Mesh

export function useMintAdminAndRewardTokens() {
  const [tokenName, setTokenName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [dummyKey,   setDummyKey]   = useState("");

  const prepareTransaction = api.mintAdminAndReward.prepareTransaction.useMutation();
  const { wallet, connected } = useWallet(); // get wallet and connection state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!connected || !wallet) {
        throw new Error("Wallet not connected");
      }

      const utxos = await wallet.getUtxos();
      const changeAddress = await wallet.getChangeAddress();

      const { unsignedTx, policyId: newPid, dummyKeyHash: newDk } 
       = await prepareTransaction.mutateAsync({
        tokenName,
        quantity,
        policyId: policyId  || undefined,
        dummyKeyHash: dummyKey || undefined,
        changeAddress,
        utxos,
      });

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      // cache identifiers for next mint
      if (!policyId) setPolicyId(newPid);
      if (!dummyKey) setDummyKey(newDk);

      console.log("Transaction Hash:", txHash);
      alert("Minted Successfully! TxHash: " + txHash);
    } catch (error) {
      console.error(error);
      alert("Minting failed.");
    }
  };

  return {
    tokenName, setTokenName,
    quantity, setQuantity,
    policyId, setPolicyId,
    dummyKey, setDummyKey,
    handleSubmit,
  };
}
