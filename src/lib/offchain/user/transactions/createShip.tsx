
import { CardanoWallet, useAddress, useWallet } from "@meshsdk/react";
import { MeshTxBuilder, Transaction, UTxO } from "@meshsdk/core";

import { refHash } from "config";


export function createShip(){


    const {wallet} = useWallet()
    const address = useAddress()
    


    const tx = new MeshTxBuilder({})

     
   
    tx.mintPlutusScriptV3
    tx.mint()
    tx.mintTxInReference(refHash, 2)
    tx.mintRedeemerValue



}