import Head from "next/head";
import AdminSection from "../../components/AdminSection";
import Link from "next/link";

import CreateAsteria from "~/lib/offchain/admin/game-transactions/createAsteria";
import ParametersForm from "~/components/admin/ParametersForm";
// These will be real components soon — placeholder content for now
/* import InputParameters from "~/components/admin/InputParameters";
import CreateAdminToken from "~/components/admin/CreateAdminToken";
import DeployValidators from "~/components/admin/DeployValidators";
import CreatePellets from "~/components/admin/CreatePellets";
import FinalizeSetup from "~/components/admin/FinalizeSetup";
 */
export default function AdminPage() {
  return (

    <>
      <Head>
        <title>Asteria Admin Console</title>
      </Head>
      <div className="mt-10 min-h-screen px-6 py-10 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">
          🛠️ Asteria Admin Console
        </h1>


          
        <div className="space-y-8">
          
          <div>
          <Link href="/admin/create-admin-and-rewards-tokens">
            <AdminSection
                title="Create Admin Tokens and Rewards token "
                icon="🎟️"
                borderColor="border-purple-500
                hover:bg-green-400/20 
                hover:border-green-400 
                transition-all duration-300" />
          </Link>
          </div>
          
          <div>
          <Link href="admin/set-parameters">
            <AdminSection
              title="Decide and Input Parameters"
              icon="🧭"
              borderColor="border-green-500 hover:bg-green-400/20 hover:border-green-400 transition-all duration-300"
            >
            
              {/* <InputParameters /> */}
            </AdminSection>
          </Link> 
          </div>


          <AdminSection
            title="Deploy Validators"
            icon="🌌"
            borderColor="border-indigo-500"
          >
            {/* <DeployValidators /> */}
          </AdminSection>

          <AdminSection
            title="Create Asteria UTXO"
            icon="🏗️"
            borderColor="border-yellow-500">
              
              <CreateAsteria />
            
            </AdminSection>
          

          <AdminSection
            title="Create Pellet UTXOs"
            icon="🌕"
            borderColor="border-cyan-500"
          >
            {/* <CreatePellets /> */}
          </AdminSection>

          <AdminSection
            title="Finalize & Launch"
            icon="✅"
            borderColor="border-red-500"
          >
            {/* <FinalizeSetup /> */}
          </AdminSection>

          
        </div>
      </div>
    </>
  );
}