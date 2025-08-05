import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {useAssets} from "@meshsdk/react";
import { AssetExtended } from "@meshsdk/core";




export default function SelectPilot({setPilot}: {setPilot: (pilot: AssetExtended) => void}){

    const assets = useAssets();
    console.log(assets);
    const pilotList = assets?.filter((asset: AssetExtended) => asset.assetName && asset.assetName.startsWith("50494c4f543"));
    console.log(pilotList);

    const handlePilotSelection = (asset: AssetExtended) => {
        console.log(asset);
        setPilot(asset);
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <p>Select Pilot</p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                       
                        {pilotList?.map((asset: AssetExtended, index) => (

                            <DropdownMenuItem key={index} onClick={() => {handlePilotSelection(asset)}}>{asset.assetName}</DropdownMenuItem>

                        ))}
                    </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}