
import { integer, Integer, 
          policyId, PolicyId, 
          assetName, AssetName, 
          scriptAddress, ScriptAddress, 
          TxOutRef, txOutRef } from "@meshsdk/core";

// Variables to be used throughout App 
// use .env for passwords and api keys
// Types start with capital letter
// Functions start with lowercase letter



//export const adminTokenName: string = "41737465726961746f6b656e"
//export const adminTokenPolicy: string = "fbeafbfb456a440b174001793c546c93bdf887730c1e12b2f9f0d293" //bytestring


export const adminTokenName: string = '57696c6c6974576f726b' // nd test tokens
export const adminTokenPolicy: string = '52ad7c6e234fdad76f3461ab57d349fa51c5d51f36c83a231b9eefcf' //nd test tokens



export const fuelTokenName: AssetName = assetName("4655454c") /// different ?
export const fuelTokenPolicy: PolicyId = policyId("734c3d33d223890dcf389a493e9ec0d33f229f497e6ff7dbcd62d5c2") /// different ?


//export const prizeTokenName = 
//export const prizeTokenPolicy = 

export const shipYardPolicy = 'ec79e6d0adb9706b5f2d1800a27b4b4990ee00ee8295158dd4d599ba'
//export const shipYardName =

// export const refHash: string = 'eda5d68d7f41c014c920d03d096a9e0e6f4d07e9491720675fa08f6584ebfacf' //Might be the old one
export const refHash: string = '3d47a597e2d716b81d6fc975736efb890c25b5fc2aeaa9d1efc93810c9f1e2e3' //Might be the old one

//pellet validator ref hash 
export const pelletRefHash: TxOutRef = txOutRef('40f99536163547b034a62fbcff2c88e963af1c5dd16186728a87504c084cc1c3', 0)
export const pelletRefHashWOUtil = "35bfe60450b7c1ea59bdd6c68bd239f7da27ac231d0c4e31ac6e307193571970"// Nd test validator
//export const pelletRefHashWOUtil = "40f99536163547b034a62fbcff2c88e963af1c5dd16186728a87504c084cc1c3"
  
//asteria validator ref hash
export const asteriaRefHash: TxOutRef = txOutRef('d20d15965e6bcfe0541938e7caf8a37b74852ece9cfed3314f1d9048b66cf8a5', 0)
export const asteriaRefHashWO: string = "4caae3ff0aa1e24668f9ea1640ad4c425b0ba1e3e9660cadb5d6fac6d00b9f45"// Nd test validator
//export const asteriaRefHashWO: string = "d20d15965e6bcfe0541938e7caf8a37b74852ece9cfed3314f1d9048b66cf8a5"
//deploy validator ref hash

//spacetime validator ref Hash 
export const spacetimeRefHash: TxOutRef = txOutRef('f1101ab594944f206d90bf16d784acff9f516ff0ba8943bbc0082d36a68a5fde', 0) 
export const spacetimeRefHashWOUtil = "636c6d42ee57a952fd1bf4b7a0a38c363a84015d74b30c1982e1a07c0f270ed9" //ND Test Validator
//export const spacetimeRefHashWOUtil = "f1101ab594944f206d90bf16d784acff9f516ff0ba8943bbc0082d36a68a5fde"

  //pellet validator address 
export const pelletValidatorAddress = 'addr_test1wqq62t863eh8z3wmv2qs3fc075egfxr0kh0cp7kmgvynj8g9aj6tm'
     //Above script address needs to be verified for the proper types as per Mesh
  //asteria validator address
export const asteriaValidatorAddress =  'addr_test1wqnjq6f6xtmqvy998g5dfvfjzlc2jysqxzf9hlnc2f4qmksq37dur'
  //spacetime validator address
export const spacetimeValidatorAddress = 'addr_test1wrk8neks4kuhq66l95vqpgnmfdyepmsqa6pf29vd6n2enwsjnrl6x'

//Game Parameters


export const ship_mint_lovelace_fee: Integer = integer(3000000);
export const max_asteria_mining: Integer = integer(200);

// const max_speed = {
//   distance: integer(1),
//   time: integer (30 * 1000), //milliseconds
// };

export const max_speed = (
  integer(1),
  integer(30000));  //mesh json format

export const max_ship_fuel: Integer = integer (100);
export const fuel_per_step: Integer = integer(10);
export const initial_fuel: Integer = integer(20);
export const min_asteria_distance: Integer = integer(30);

export const createAsteriaRefHash = "459b67a583f2c9a06d9dc1fc9ac7ea077a77fb82170feb2c9351dbb4622cbfea"
