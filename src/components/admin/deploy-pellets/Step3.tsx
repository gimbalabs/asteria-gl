// pellet array is in the index of deploy-pellets and is passed as a prop
//receives unsigned tx and user starts signing 
//click deploy pellets button, send the pellets to the backend (server/api/routers/admin/pelletDeploy.ts) 

import { PelletParams } from "~/utils/pelletUtils";
import { api } from "~/utils/api";

export default function Step3({pellets}: {pellets: PelletParams}) {
    const deployPellets = api.pelletDeploy.deploy.useMutation();

    return (
        <div>

        </div>
    )
}