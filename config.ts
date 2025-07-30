
import { integer, Integer, 
       } from "@meshsdk/core";

// Variables to be used throughout App 
// use .env for passwords and api keys
// Types start with capital letter
// Functions start with lowercase letter


export const adminTokenName: string = '415472657374' // nd test tokens
export const adminTokenPolicy: string = '703e1124055f89d4d72d4b129b578949151adb886fccaf89dd6c8ed4' //nd test tokens


export const pelletRefHashWOUtil = "e1d25b61b489672b63db36c3b4ce6884ad0aaa77ddaeef69a03948fcb40659a1"// Nd test validator

export const asteriaRefHashWO: string = "af8335a878b9d41222a26b6f465033ca45a367d6a29b05e991ca351f062accb4"// Nd test validator

export const spacetimeRefHashWOUtil = "41a7e30b7cc9dcb9ac731396d398c852556990ae71af454219d2116297ca5537" //ND Test Validator


//Game Parameters


export const ship_mint_lovelace_fee: Integer = integer(4000000);
export const max_asteria_mining: Integer = integer(20);

export const max_speed = (
  integer(1),
  integer(30000));  //mesh json format // user can move maximum of 8 steps

export const max_ship_fuel: Integer = integer (50);
export const fuel_per_step: Integer = integer(1);
export const initial_fuel: Integer = integer(40);
export const min_asteria_distance: Integer = integer(50); // grid 100*100 blocks // randomizer on the front end for start position 50 or more
