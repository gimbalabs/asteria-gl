import { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { api } from "~/utils/api";
import { AssetExtended } from "@meshsdk/core";



export function useMoveShip() {
    const { wallet, connected } = useWallet();
    const [assets, setAssets] = useState<AssetExtended[]>([]);

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
}
