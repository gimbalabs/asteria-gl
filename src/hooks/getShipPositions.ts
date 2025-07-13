import { MaestroProvider} from "@meshsdk/core";

import { maestroProvider} from "~/server/provider/maestroProvider";
import { UTxO, hexToString } from "@meshsdk/core";
import { deserializeDatum } from "@meshsdk/core";

import { useEffect, useState } from "react";

interface ShipDatumData {
    posX: number,
    posY: number,
    name: string,
   
}


export default function getShipPositions(){

    const [shipState, setShipState] = useState<ShipDatumData[]>() 

    const maestroProvider = new MaestroProvider({
        network: "Preprod",
        apiKey: process.env.NEXT_PUBLIC_MAESTRO_PREPROD_KEY, // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
        turboSubmit: false, // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
      });

    useEffect( () => {
        async function runShipPositions(){

            
            const shipUtxos: UTxO[] = await maestroProvider.fetchAddressUTxOs('addr_test1wz6mq45nsaqym9e5r0xa0d2fz677t9mwy5plk8ranacf82sjxy58f')
                
            const shipPositions: ShipDatumData[]= []

            shipUtxos.map((ship) => {
                    const datumData = deserializeDatum(ship.output.plutusData)
                    const resolvedDatum = {
                        posX: datumData.fields[0].int,
                        posY: datumData.fields[1].int,
                        name: hexToString(datumData.fields[2].bytes)
                    }

                    shipPositions.push(resolvedDatum)
            })
            
            setShipState(shipPositions)
                

        }

        runShipPositions()
  
    },[])    

    
    return {shipState}
}