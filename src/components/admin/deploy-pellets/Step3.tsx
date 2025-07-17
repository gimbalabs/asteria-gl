// pellet array is in the index of deploy-pellets and is passed as a prop
//receives unsigned tx and user starts signing 
//click deploy pellets button, send the pellets to the backend (server/api/routers/admin/pelletDeploy.ts) 

import { PelletParams } from "~/utils/pelletUtils";
import { api } from "~/utils/api";
import { useWallet } from "@meshsdk/react";
import Link from "next/link";
import { useState } from "react";

export default function Step3({pellets}: {pellets: PelletParams}) {
    const { wallet, connected } = useWallet();
    const startDeploy = api.pelletDeploy.startDeploy.useMutation();
    const nextBatch = api.pelletDeploy.nextBatch.useMutation();
    const [submittedBatches, setSubmittedBatches] = useState<{batchNum: number, txHash: string}[]>([]);

    const handleDeploy = async () => {
        try {
            if (!connected || !wallet) {
                throw new Error("Wallet not connected");
            }

            const utxos = await wallet.getUtxos();
            const changeAddress = await wallet.getChangeAddress();
            const collateral = (await wallet.getCollateral())[0]!;

            // Start initial deployment
            const {sessionId, unsignedTx} = await startDeploy.mutateAsync({
                pellets, 
                utxos, 
                changeAddress, 
                collateral
            });

            const signedTx = await wallet.signTx(unsignedTx, true);
            const firstTxHash = await wallet.submitTx(signedTx);
            setSubmittedBatches(prev => [...prev, { batchNum: 0, txHash: firstTxHash }]);

            // Handle subsequent batches
            let batchResult: { done: boolean, unsignedTx?: string } = { done: false };
            let lastTxHash = firstTxHash; // Track the most recent transaction hash
            
            while (!batchResult.done) {
                const utxos = await wallet.getUtxos();
                const collateral = (await wallet.getCollateral())[0]!;
                batchResult = await nextBatch.mutateAsync({
                    sessionId,
                    lastTxHash,
                    utxos,
                    changeAddress,
                    collateral
                });
                
                const signedBatchTx = await wallet.signTx(batchResult.unsignedTx!, true);
                const currentTxHash = await wallet.submitTx(signedBatchTx);
                setSubmittedBatches(prev => [...prev, { 
                    batchNum: prev.length + 1, 
                    txHash: currentTxHash 
                }]);

                // Update lastTxHash for the next iteration
                lastTxHash = currentTxHash;

                if (!batchResult.done && batchResult.unsignedTx) {
                    const signedBatchTx = await wallet.signTx(batchResult.unsignedTx, true);
                    const finalTxHash = await wallet.submitTx(signedBatchTx);
                    setSubmittedBatches(prev => [...prev, { 
                        batchNum: prev.length + 1, 
                        txHash: finalTxHash 
                    }]);
                    
                    // Update lastTxHash again
                    lastTxHash = finalTxHash;
                }
            }
        } catch (error) {
            console.error(error);
            alert("Error in deployment process");
        }
    };

    return (
        <div>
            <div className="flex items-center gap-5">
                {submittedBatches.map(({ batchNum, txHash }) => (
                        <Link 
                            key={txHash}
                            href={`https://preprod.cexplorer.io/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                        >
                            <span>Batch {batchNum}</span>
                        </Link>
                    ))}
            </div>
            <div>
                <button onClick={handleDeploy}>Deploy Pellets</button>
            </div>
        </div>
    );
}