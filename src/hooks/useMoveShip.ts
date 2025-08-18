import { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { api } from "~/utils/api";
import { AssetExtended } from "@meshsdk/core";



export function useMoveShip(pilot?: AssetExtended | null) {
    const { wallet, connected } = useWallet();
    const [assets, setAssets] = useState<AssetExtended[]>([]);
    const [shipStateDatum, setShipStateDatum] = useState<any>(null);
    const [newPosX, setNewPosX] = useState<number| null>();
    const [newPosY, setNewPosY] = useState<number | null>();
    const [currentX, setCurrentX] = useState<number | null>(null)
    const [currentY, setCurrentY] = useState<number | null>(null)
    const [timeToLive, setTimeToLive] = useState<Date | null>(null)


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

    const handleShipState = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const result: any = await ShipStateDatum.mutateAsync({assets: assets, pilot: pilot});
        setCurrentX(result.coordinateX)
        setCurrentY(result.coordinateY)
        setShipStateDatum(result);
        setTimeToLive(new Date(result.posixTime));
        console.log("Time to Live: ", timeToLive)

    }

    const handleMoveShip = async(e: React.FormEvent<HTMLFormElement>) => {
        console.log(newPosX, newPosY)
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
        timeToLive, handleShipState, assets, shipStateDatum, setNewPosX, setNewPosY, handleMoveShip, newPosX, newPosY, setCurrentX, setCurrentY, currentX, currentY
    }
}