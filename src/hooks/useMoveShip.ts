import { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { api } from "~/utils/api";
import { AssetExtended } from "@meshsdk/core";



export function useMoveShip() {
    const { wallet, connected } = useWallet();
    const [assets, setAssets] = useState<AssetExtended[]>([]);
    const [shipStateDatum, setShipStateDatum] = useState<any>(null);
    const [newPosX, setNewPosX] = useState<number>(0);
    const [newPosY, setNewPosY] = useState<number>(0);

    useEffect(() => {
        const getAssets = async () => {
            if (connected && wallet) {
                const walletAssets = await wallet.getAssets();
                setAssets(walletAssets);
            }
        };
        getAssets();
    }, [connected, wallet]);

    const ShipStateDatum = api.moveShip.queryShipStateDatum.useMutation();
    const moveShip = api.moveShip.moveShip.useMutation();

    const shipState = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const result = await ShipStateDatum.mutateAsync(assets);
        setShipStateDatum(result);
    }

    const handleMoveShip = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const collateral = (await wallet.getCollateral())[0]!;
        const changeAddress = await wallet.getChangeAddress();
        const utxos = await wallet.getUtxos();
        const input_to_move = {
            newPosX: newPosX,
            newPosY: newPosY,
            shipStateDatum: shipStateDatum,
            changeAddress: changeAddress,
            utxos: utxos,
            collateral: collateral,
        }  

        const unsignedTx = await moveShip.mutateAsync(input_to_move); // Build the input here
        const signedTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);
        console.log("Transaction Hash:", txHash);
        alert("Moved Successfully! TxHash: " + txHash);
    }

    return {
        shipState, assets, shipStateDatum, setNewPosX, setNewPosY, handleMoveShip, newPosX, newPosY
    }
}