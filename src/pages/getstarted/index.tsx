import { CardanoWallet } from "@meshsdk/react"

import CreateShip from "~/components/tx/createShip"

export default function GetStarted(){


    return (
        <>
            <nav>
                <p>nav bar</p>
                <CardanoWallet /> 
            </nav>
            <main>
                <h1>Start playing Asteria by minting your Pilot token!</h1>
                <CreateShip />

            </main>
            
        
        
        </>
    )
}