import { Asset, PlutusScript ,MaestroProvider, MeshTxBuilder, integer, policyId, UTxO, conStr0, ByteString} from "@meshsdk/core";
import { useState, useEffect } from "react";
import { useAssets, useWallet } from "@meshsdk/react";

import { fromScriptRef,resolvePlutusScriptAddress} from "@meshsdk/core-cst";
import { CardanoWallet } from "@meshsdk/react";

import { adminTokenPolicy, adminTokenName, asteriaRefHashWO, spacetimeRefHashWOUtil } from "config";
import checkAdminToken from "~/hooks/checkAdminToken";
// scriptAddress = "addr_test1vrqd62jeu7jt67zt3ajl8agyfnsa0ltjksqahcsqlax3kvq8qhe3x" asteria 
const maestroApiKey = process.env.NEXT_PUBLIC_MAESTRO_PREPROD_KEY


export default function CreateAsteria(){

  const { wallet, connected } = useWallet();
    
  const [success, setSuccess] = useState<string>()
  const [refHashUtxo, setRefHashUtxo] = useState<UTxO[]>()
  const [adminToken, setAdminToken] = useState<Asset | undefined>()
  const [asteriaDatum, setDatum] = useState<ByteString | undefined>()
  const [asteriaValidatorAddress, setAsteriaValidatorAddress] = useState<string| undefined>()
  

    const blockchainProvider = new MaestroProvider({
          network: "Preprod",
          apiKey: maestroApiKey, // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
          turboSubmit: false, // 
        });

    const {connectedAdminToken, isLoadingAdminToken } = checkAdminToken()
    
    
    
    useEffect(() => {

            async function findDeployUtxos(){
            const deployUtxos: UTxO[] = await blockchainProvider.fetchUTxOs(asteriaRefHashWO,0) 
            setRefHashUtxo(deployUtxos)

            const spaceTimeUtxo: UTxO[] = await blockchainProvider.fetchUTxOs(spacetimeRefHashWOUtil, 0)
    
            console.log(deployUtxos)    

                if(deployUtxos){
                const asteriaScriptReffromTx: string = deployUtxos[0].output.scriptRef
                const asteriaScriptRef = fromScriptRef(asteriaScriptReffromTx)
                const asteriaPlutusScript = asteriaScriptRef as PlutusScript
                const asteriaValidatorAddress = resolvePlutusScriptAddress(asteriaPlutusScript) // gets the address of the validator from the script Hash
                setAsteriaValidatorAddress(asteriaValidatorAddress)
                
                console.log(asteriaValidatorAddress)
                const shipyardPolicyId = await spaceTimeUtxo[0].output.scriptHash
                
                console.log("Shipyard policy:" , shipyardPolicyId)
                const asteriaDatum = conStr0([
                  integer(0), //ship counter
                  policyId(shipyardPolicyId) // policyId of spacetime validator
                ])
                setDatum(asteriaDatum)
                }
            
              
            }
              void findDeployUtxos()
    }, [])
    


      
      async function onSubmit(){
        
        
        const utxos = await wallet.getUtxos()
        const utxoWithAdminToken = utxos.map((utxo) => {
    
               const assets = utxo.output.amount
               const asset = assets.find((asset) => asset.unit.startsWith(adminTokenPolicy) )
               if(asset){
                setAdminToken(asset)
               }
            }
            )
        
        const txBuilder = new MeshTxBuilder({
            fetcher: blockchainProvider,
            verbose: true,
          });
        
        const totalRewardsAsset : Asset[] = [{
        unit: "lovelace",
        quantity:  "3000000",
    },
    {
        unit: adminTokenPolicy+ adminTokenName,
        quantity: "1"
    }];

        const changeAddress = await wallet.getChangeAddress()
        
        console.log("asteria datum  ", asteriaDatum)

        const unsignedTx = await txBuilder
        .txOut(asteriaValidatorAddress, totalRewardsAsset)
        .txOutInlineDatumValue(asteriaDatum, "JSON")
        .changeAddress(changeAddress)
        .selectUtxosFrom(utxos)
        .setNetwork("preprod")
        .complete()
       

        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);
        
        if(txHash){
          setSuccess(txHash)
          
        }
      
    }

  
    return (
      <div>

        <CardanoWallet isDark={true} />

        <p>Send transaction to create Asteria</p>
        <form onSubmit={(e) => e.preventDefault()}>
          <p>Create Asteria Utxo by sending an admin token to the Asteria validator</p>
        
          {connected && connectedAdminToken && !isLoadingAdminToken ? 
            <div className=" flex flex-col gap-3 items-center">
              
              <p className="text-galaxy-info"> Admin Token - {connectedAdminToken}</p>
              {refHashUtxo && asteriaValidatorAddress ? 
                <button className="bg-black text-white w-1/5" onClick={onSubmit}>send</button> :
                <p className="text-galaxy-danger">Awaiting ref utxo and validator address... </p>
              }

            </div> 
              : 
            
              <p>Your wallet doesn't contain an admin token</p>
              
          
          }
      
        
         </form>

       
         {success && <p>{success}</p>}
     
      </div>
    )
    
    
  

  }