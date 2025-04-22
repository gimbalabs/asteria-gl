import { CardanoWallet } from "@meshsdk/react"

import CreateShip from "~/components/tx/createShip"

export default function GetStarted(){


    return (
        <>
            <nav>
                <CardanoWallet isDark={true} /> 
            </nav>
            <main>
                <h1>Start playing Asteria by minting your Pilot token!</h1>
                <CreateShip />

            </main>
            
        
        
        </>
    )
}