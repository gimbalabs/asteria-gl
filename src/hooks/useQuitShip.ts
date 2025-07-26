import { useCallback } from "react";
import { useWallet } from "@meshsdk/react";
import { api } from "~/utils/api";

export function useQuitShip() {
  const { wallet, connected } = useWallet();
  const quitShip = api.quitShip.quitShip.useMutation();

  const handleQuitShip = useCallback(
    async (e?: React.MouseEvent<HTMLButtonElement>) => {
      e?.preventDefault();
      if (!connected || !wallet) return; // nothing to do

      try {
        // Grab everything all at once
        const [collateral, changeAddress, utxos, assets] = await Promise.all([
          wallet.getCollateral(),
          wallet.getChangeAddress(),
          wallet.getUtxos(),
          wallet.getAssets(),
        ]);
        if (!collateral[0]) throw new Error("No collateral UTxO found.");
        const collateralUtxo = collateral[0];

        const unsignedTx = await quitShip.mutateAsync({
          assets,
          changeAddress,
          utxos,
          collateral: collateralUtxo,
        });

        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);

        console.log("Transaction Hash:", txHash);
        alert(`Quit Successfully! TxHash: ${txHash}`);
      } catch (err) {
        console.error(err);
        alert((err as Error).message);
      }
    },
    [connected, wallet, quitShip]
  );

  return {
    handleQuitShip,
    isReady: connected && !!wallet,
    error: quitShip.error,
  };
}
