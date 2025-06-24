import { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { api } from "~/utils/api";
import { AssetExtended } from "@meshsdk/core";



export function useMoveShip() {
    const { wallet, connected } = useWallet();
    const [assets, setAssets] = useState<AssetExtended[]>([]);
    // Get assest from wallet and useEffects because it's an async function
    useEffect(() => {
        const getAssets = async () => {
            if (connected && wallet) {
                const walletAssets = await wallet.getAssets();
                setAssets(walletAssets);
                console.log(walletAssets);
            }
        };
        getAssets();
    }, [wallet, connected]);

    const ShipStateDatum = api.moveShip.queryShipStateDatum.useQuery(assets);
    return {
        ShipStateDatum,
    }
}
