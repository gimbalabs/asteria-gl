
import { integer, policyId, assetName, scriptHash, scriptAddress } from "@meshsdk/core";

// Variables to be used throughout App 
// use .env for passwords and api keys


export const adminTokenName: assetName = '41737465726961436f696e'
export const adminTokenPolicy: policyId = 'f06038e916ab3f1fb15280641280f8c13cfd684f6ce31ac000ed6e8f' //bytestring

export const fuelTokenName: assetName = '4655454c'
export const fuelTokenPolicy: policyId = '3830a960240a7461fd8c121d2df596d5efb87fa7670c7285b9ad4000'

//export const prizeTokenName = 
//export const prizeTokenPolicy = 

//export const shipYardPolicy = 
//export const shipYardName =

export const refHash: scriptHash = '08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f'

//pellet validator ref hash 
export const pelletRefHash: scriptHash = '08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f#1'
  
//asteria validator ref hash
export const asteriaRefHash: scriptHash = '08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f#0'
//deploy validator ref hash

//spacetime validator ref Hash 
export const spacetimeRefHash: scriptHash = '08834a9c06c3bc5ede5c6a0845e67d077dbd0bcadd8b771f785ed45745907b0f#2' 
       

  //pellet validator address 
export const pelletValidatorAddress: scriptAddress = 'addr_test1wqurp2tqys98gc0a3sfp6t04jm27lwrl5anscu59hxk5qqq4fhu8y'
  //asteria validator address
//export const asteriaValidatorAddress =  
  //spacetime validator address
//export const spacetimeValidatorAddress = 

//Game Parameters


export const ship_mint_lovelace_fee: integer = integer(3000000);
export const max_asteria_mining: integer = integer(50);

// const max_speed = {
//   distance: integer(1),
//   time: integer (30 * 1000), //milliseconds
// };

export const max_speed = (
  integer(1),
  integer(30000));  //mesh json format

export const max_ship_fuel: integer = integer (100);
export const fuel_per_step: integer = integer(1);
export const initial_fuel: integer = integer(30);
export const min_asteria_distance: integer = integer(10);
