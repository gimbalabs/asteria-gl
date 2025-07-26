
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


export const adminTokenName: string = '415472657374' // nd test tokens
export const adminTokenPolicy: string = '703e1124055f89d4d72d4b129b578949151adb886fccaf89dd6c8ed4' //nd test tokens



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
export const pelletRefHashWOUtil = "e1d25b61b489672b63db36c3b4ce6884ad0aaa77ddaeef69a03948fcb40659a1"// Nd test validator
//export const pelletRefHashWOUtil = "40f99536163547b034a62fbcff2c88e963af1c5dd16186728a87504c084cc1c3"
  
//asteria validator ref hash
export const asteriaRefHash: TxOutRef = txOutRef('d20d15965e6bcfe0541938e7caf8a37b74852ece9cfed3314f1d9048b66cf8a5', 0)
export const asteriaRefHashWO: string = "af8335a878b9d41222a26b6f465033ca45a367d6a29b05e991ca351f062accb4"// Nd test validator
//export const asteriaRefHashWO: string = "d20d15965e6bcfe0541938e7caf8a37b74852ece9cfed3314f1d9048b66cf8a5"
//deploy validator ref hash

//spacetime validator ref Hash 
export const spacetimeRefHash: TxOutRef = txOutRef('f1101ab594944f206d90bf16d784acff9f516ff0ba8943bbc0082d36a68a5fde', 0) 
export const spacetimeRefHashWOUtil = "41a7e30b7cc9dcb9ac731396d398c852556990ae71af454219d2116297ca5537" //ND Test Validator
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
export const max_asteria_mining: Integer = integer(20);

// const max_speed = {
//   distance: integer(1),
//   time: integer (30 * 1000), //milliseconds
// };

export const max_speed = (
  integer(1),
  integer(30000));  //mesh json format

export const max_ship_fuel: Integer = integer (50);
export const fuel_per_step: Integer = integer(1);
export const initial_fuel: Integer = integer(40);
export const min_asteria_distance: Integer = integer(10);

export const createAsteriaRefHash = "459b67a583f2c9a06d9dc1fc9ac7ea077a77fb82170feb2c9351dbb4622cbfea"
