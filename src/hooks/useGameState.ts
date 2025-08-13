import { MaestroProvider} from "@meshsdk/core";

import { maestroProvider} from "~/server/provider/maestroProvider";
import { UTxO, hexToString } from "@meshsdk/core";
import { deserializeDatum } from "@meshsdk/core";

import { api } from "~/utils/api";

import { useEffect, useState } from "react";

interface ShipDatumData {
    posX: number,
    posY: number,
    name: string,
    fuel: number
   
}

interface PelletDatumData {
    posX: number | undefined,
    posY: number | undefined,
    fuel: number | undefined, 
    utxo: string | undefined,
    index: number | undefined
}


export default function getGameState(){

    const [shipState, setShipState] = useState<ShipDatumData[]>() 
    const [pelletState, setPelletState] = useState<PelletDatumData[]>()
    const [isError, setIsError] = useState("")

    
    const {data: pelletData, isLoading: isLoadingPelletState,  error } = api.gameState.queryPelletState.useQuery()
    const {data: shipData, isLoading: isLoadingShipState, error: shipError} = api.gameState.queryShipState.useQuery()

    useEffect( () => {
        if(!!shipData){

            let shipPositions: ShipDatumData[] = []

            shipData.shipUtxos.map((ship) => {
                    const datumData = deserializeDatum(ship.output.plutusData)
                    const resolvedData = {
                        posX: datumData.fields[0].int,
                        posY: datumData.fields[1].int,
                        name: hexToString(datumData.fields[2].bytes),
                        fuel: Number(ship.output.amount[2].quantity),
                        }
                    console.log(ship.output.amount)
                    shipPositions.push(resolvedData)
            })
            
            setShipState(shipPositions)

        }

  
    },[shipData])   
    
    if(error || shipError){
            setIsError(error.message)
        }

    useEffect( () => {

       
            
        if(!!pelletData){ 

            const pelletPositions: PelletDatumData[] = []

            pelletData.pelletUtxos.map((pellet) => {
                const pelletDatum = deserializeDatum(pellet.output.plutusData)
                const pelletData = {
                    posX: pelletDatum.fields[0].int,
                    posY: pelletDatum.fields[1].int,
                    fuel: Number(pellet.output.amount[1].quantity),
                    utxo: pellet.input.txHash,
                    index: pellet.input.outputIndex
                }        
                pelletPositions.push(pelletData)
            })

            setPelletState(pelletPositions)
  
        }
 
    }, [pelletData])

    
    return {shipState, isLoadingShipState, setPelletState, isLoadingPelletState, isError, pelletState }
}