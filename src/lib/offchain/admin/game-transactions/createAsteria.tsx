import { Asset, PlutusScript ,MaestroProvider, MeshTxBuilder, serializePlutusScript, serializeRewardAddress, integer, policyId, UTxO, Data} from "@meshsdk/core";
import { useState } from "react";
import { useWallet } from "@meshsdk/react";
import { refHash } from "config";
import { fromScriptRef,resolvePlutusScriptAddress} from "@meshsdk/core-cst";

// scriptAddress = "addr_test1vrqd62jeu7jt67zt3ajl8agyfnsa0ltjksqahcsqlax3kvq8qhe3x" asteria 
const maestroApiKey = process.env.NEXT_PUBLIC_MAESTRO_API 


export default async function CreateAsteria(){

    const { wallet, connected } = useWallet();
    
    const [success, setSuccess] = useState<string>()
    const [adminToken, setAdminToken] = useState<string| null>()

    const blockchainProvider = new MaestroProvider({
      network: "Preprod",
      apiKey: maestroApiKey, // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
      turboSubmit: false, // 
    });


    const utxos = await wallet.getUtxos()
    const utxoWithAdminToken = utxos.map((utxo) => {

           const assets = utxo.output.amount
           const asset = assets.find((asset) => asset.unit.startsWith('dd3314723ac41eb2d91e4b695869ff5597f0f0acea9f063d4adb60d5') )
           if(asset){
            setAdminToken(asset)
           }
        }
        )



    async function onSubmit(){
        const txBuilder = new MeshTxBuilder({
            fetcher: blockchainProvider,
            verbose: true,
          });

        
       

        const changeAddress = await wallet.getChangeAddress()

        const deployUtxos: Promise<UTxO[]> = await blockchainProvider.fetchUTxOs(refHash) 

        const asteriaScriptReffromTx: string = deployUtxos[0].output.scriptRef
        const asteriaScriptRef = fromScriptRef(asteriaScriptReffromTx)
        const asteriaPlutusScript = asteriaScriptRef as PlutusScript
        const asteriaValidatorAddress = resolvePlutusScriptAddress(asteriaPlutusScript) // gets the address of the validator from the script Hash

        const shipyardPolicyId = deployUtxos[2].output.scriptHash

        const asteriaDatum = (
          integer(0), //ship counter
          policyId(shipyardPolicyId) // policyId of spacetime validator
        )
        
        

        const unsignedTx = await txBuilder
        .txOut(asteriaValidatorAddress, [{unit: "dd3314723ac41eb2d91e4b695869ff5597f0f0acea9f063d4adb60d5617374657269612d61646d696e", quantity: "1" } ])
        .txOutInlineDatumValue(asteriaDatum)
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .complete()
       

        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        
        if(txHash){
          setSuccess(txHash)
          
        }
      
    }

    
      return (
        <div>
          <p>Send transaction to create Asteria</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <p>Create Asteria Utxo by sending an admin token to the Asteria validator</p>
          
            {connected ? 
            
              adminToken ? <button className="bg-black text-white" onClick={onSubmit}>send</button>: 
                  
                  <p> Your wallet doesn't hold a valid Admin Token</p>
            
            
              : <p>need to be connected valid script address</p>
              
              }
          
          
           </form>

           {success && <p>{success}</p>}
       
        </div>
      )
      
      
    

  }