
import Head from "next/head";
import AdminSection from "../../components/AdminSection";

import CreateAsteria from "~/lib/offchain/admin/game-transactions/createAsteria";
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
      <div className="min-h-screen px-6 py-10 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">
          🛠️ Asteria Admin Console
        </h1>

        <AdminSection
            title="Create Admin Token"
            icon="🎟️"
            borderColor="border-purple-500"
          >
            {/* <CreateAdminToken /> */}
          </AdminSection>
          
        <div className="space-y-8">
          <AdminSection
            title="Input Parameters"
            icon="🧭"
            borderColor="border-green-500"
          >
            {/* <InputParameters /> */}
          </AdminSection>




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

          <CreateAsteria />
        </div>
      </div>
    </>
  );
}