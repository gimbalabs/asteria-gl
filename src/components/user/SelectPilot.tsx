import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {useAssets} from "@meshsdk/react";
import { AssetExtended } from "@meshsdk/core";
import { hexToString } from "~/utils/hextoString";




export default function SelectPilot({pilot, setPilot}: {pilot: AssetExtended | undefined, setPilot: (pilot: AssetExtended) => void}){

    const assets = useAssets();
    // console.log(assets);
    const pilotList = assets?.filter((asset: AssetExtended) => asset.assetName && asset.assetName.startsWith("50494c4f543"));
    // console.log(pilotList);

    const handlePilotSelection = (asset: AssetExtended) => {
        console.log(asset);
        setPilot(asset);
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    <p>Select Pilot</p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                       
                        {pilotList?.map((asset: AssetExtended, index) => (

                            <DropdownMenuItem key={index} onClick={() => {handlePilotSelection(asset)}}>{hexToString(asset.assetName)}</DropdownMenuItem>

                        ))}
                    </DropdownMenuContent>
            </DropdownMenu>
            <div>
                <p>Pilot: {hexToString(pilot?.assetName ?? "")}</p>
            </div>
        </div>
    )
}