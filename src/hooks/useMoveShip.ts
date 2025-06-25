import { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { api } from "~/utils/api";
import { AssetExtended } from "@meshsdk/core";



export function useMoveShip() {
    const { wallet, connected } = useWallet();
    const [assets, setAssets] = useState<AssetExtended[]>([]);
    const [shipStateDatum, setShipStateDatum] = useState<any>(null);

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

    const shipState = async(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const result = await ShipStateDatum.mutateAsync(assets);
        setShipStateDatum(result);
    }

    return {
        shipState, shipStateDatum
    }
}
