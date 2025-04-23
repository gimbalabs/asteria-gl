import { type Asset } from "@meshsdk/core";
import { useWallet, useAssets } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { adminTokenPolicy } from "config";

export default function checkAdminToken() {
  const { wallet, connected } = useWallet();
  const walletAssets = useAssets()

  const [connectedAdminToken, setConnectedAdminToken] = useState<
    string | undefined
  >(undefined);


  const [isLoadingAdminToken, setIsLoadingAdminToken] = useState(true);

  useEffect(() => {
    async function checkAdminToken() {
        if (wallet && connected) {
            // get contributor token
            const walletAssets = await wallet.getAssets()
            walletAssets.forEach((a) => {
                
                if (a.unit.startsWith(adminTokenPolicy)) {

                    setConnectedAdminToken(a.unit)
                }

                    
            } )
        setIsLoadingAdminToken(false);
        }
    
    }
    void checkAdminToken();
  }, [wallet]);

  return {
    connectedAdminToken,
    isLoadingAdminToken,
  };
}
