import { CardanoWallet } from "@meshsdk/react";
import Link from "next/link";

import CreateAsteria from "~/lib/offchain/admin/game-transactions/createAsteria";

export default function AdminPage() {

  
  return (
  <div>

    
    <h1 className="mb-2">THIS IS Admin</h1>
    <Link className="font-bold " href="/admin/deploy-pellet">Deploy Pellets - click me </Link>
    
    <CreateAsteria />
     
  </div>
  


);


}
