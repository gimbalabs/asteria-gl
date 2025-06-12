import { useWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { AssetExtended } from "@meshsdk/core";
import { api } from "~/utils/api";

export default function MoveShipComponent() {
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

    if (!connected || !wallet) {
        return (
            <div>
                <h1>Connect wallet to view your ship</h1>
            </div>
        );
    }

    return (
        <div>
            <h1>Move Ship</h1>
        </div>
    );
}