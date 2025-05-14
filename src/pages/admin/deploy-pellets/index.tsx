import { api } from "~/utils/api";
import { useState } from "react";
import { useWallet } from "@meshsdk/react";
import { PelletParams} from "~/utils/pelletUtils";
import Step1 from "~/components/admin/deploy-pellets/Step1";
import Step2 from "~/components/admin/deploy-pellets/Step2";
import Step3 from "~/components/admin/deploy-pellets/Step3";



export default function DeployPellet() {
    const {connected} = useWallet();
    const [currentStep, setCurrentStep] = useState(1);
    const [pellets, setPellets] = useState<PelletParams>([]);


    // 1. import data from db to get values for:
    // shipyard policy: hash of spacetime.ak
    // pellet validator address
    // Pellet refernce tx hash
    // Pellet reference tx index

    // 2. generate pellets + CSV file (Step1 component)

    // 3a. Place to upload CSV files
    
    // 3.b Read the CSV or pellets(variable from useState) data for the datum and fuel tokens
    // if (csv) {
    //     // TODO: Read the CSV data for the datum and fuel tokens
    // }
    // else {
    //     if(pellets) {
    //         // TODO: Read the pellets data for the datum and fuel tokens
    //     }
    // }

    // 4. Build a transaction to mint the pellet UTXOs w/ the correct fuel tokens in each UTXO + the reward tokens(optional)

    // 5. The output address of the transaction is the pellet validator address

    // 6. Sign and submit the transaction
  // Step render functions just return JSX and use the shared state/functions
    const renderStep1 = () => (
        <>
            <Step1 setPellets={setPellets} />
            <button onClick={() => setCurrentStep(currentStep + 1)}>
                Next Step &rarr;
            </button>
        </>
    );

    const renderStep2 = () => (
        <>
            <Step2/>
            <button onClick={() => setCurrentStep(currentStep - 1)} className="mr-5">
                &larr; Previous Step
            </button>
            <button onClick={() => setCurrentStep(currentStep + 1)} className="ml-5">
                Next Step &rarr;
            </button>
        </>
    );

    const renderStep3 = () => (
        <>
            <Step3/>
            <button onClick={() => setCurrentStep(currentStep - 1)}>
                &larr; Previous Step
            </button>
        </>
    );

    return (
        <div>
            <h1>Deploy Pellets</h1>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </div>
    )
}
