import { useWallet } from "@meshsdk/react";
import { useCreateShipTx } from "~/hooks/useCreateShip"


export default function createShipComponent(){

    const {handleSubmit} = useCreateShipTx()
    const {connected} = useWallet();

    if (!connected) {
        return (
        <h2 className="font-bold text-galaxy-danger">
            Please connect your wallet before Creating your ship
        </h2>
        );
    }


    return (
        <div className="pt-5 pb-5">

            
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 items-center text-black">
                <h2 className="text-white">Click the button to create an asteria ship, you'll be randomly placed on the grid </h2>

                <button type="submit" className={`inline-block px-6 py-3 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2`}>
                    Create ship
                </button>


            </form> 
            


        </div>
    )
}