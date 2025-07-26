import { AssetExtended } from "@meshsdk/core";
import useMineAsteria from "~/hooks/useMineAsteria";



export default function MineAsteria({assets}: {assets: AssetExtended[]}){

    const {txHash, handleSubmitMineAsteria, asteriaMined} = useMineAsteria(assets)


    return (

        <div>
            <h2>Congratulations you have reached Asteria!!!</h2>
            <h3>Now claim your rewards great and weary pilot</h3>
            <button onClick={handleSubmitMineAsteria} className={`inline-block px-6 py-3 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2`}>Mine Asteria</button>

            {txHash && <p>You've successfully mined asteria! Through grit and determination, you managed to secure {asteriaMined} lovelace from the planet core. Unfortunately your ship didn't make it , struck by an asteroid whilst attempting escape. Thanks for playing</p>}
        </div>


    )


}