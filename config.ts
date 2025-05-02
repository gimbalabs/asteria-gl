
import { integer, Integer, policyId, PolicyId, assetName, AssetName, scriptHash, ScriptHash, scriptAddress, ScriptAddress } from "@meshsdk/core";

// Variables to be used throughout App 
// use .env for passwords and api keys
// Types start with capital letter
// Functions start with lowercase letter



export const adminTokenName: AssetName = assetName('41737465726961746f6b656e')
export const adminTokenPolicy: PolicyId = policyId('fbeafbfb456a440b174001793c546c93bdf887730c1e12b2f9f0d293') //bytestring


export const fuelTokenName: AssetName = assetName('4655454c')
export const fuelTokenPolicy: PolicyId = policyId('3830a960240a7461fd8c121d2df596d5efb87fa7670c7285b9ad4000')

//export const prizeTokenName = 
//export const prizeTokenPolicy = 

//export const shipYardPolicy = 
//export const shipYardName =

export const refHash: ScriptHash = scriptHash('08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f')

//pellet validator ref hash 
export const pelletRefHash: ScriptHash = scriptHash('08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f#1')
  
//asteria validator ref hash
export const asteriaRefHash: ScriptHash = scriptHash('08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f#0')
//deploy validator ref hash

//spacetime validator ref Hash 
export const spacetimeRefHash: ScriptHash = scriptHash('08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f#2') 
       

  //pellet validator address 
export const pelletValidatorAddress: ScriptAddress = scriptAddress('addr_test1wqurp2tqys98gc0a3sfp6t04jm27lwrl5anscu59hxk5qqq4fhu8y')
  //asteria validator address
//export const asteriaValidatorAddress =  
  //spacetime validator address
//export const spacetimeValidatorAddress = 

//Game Parameters


export const ship_mint_lovelace_fee: Integer = integer(3000000);
export const max_asteria_mining: Integer = integer(50);

// const max_speed = {
//   distance: integer(1),
//   time: integer (30 * 1000), //milliseconds
// };

export const max_speed = (
  integer(1),
  integer(30000));  //mesh json format

export const max_ship_fuel: Integer = integer (100);
export const fuel_per_step: Integer = integer(1);
export const initial_fuel: Integer = integer(30);
export const min_asteria_distance: Integer = integer(10);
