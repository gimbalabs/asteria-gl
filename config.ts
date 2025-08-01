
import { assetName, AssetName, integer, Integer, 
       } from "@meshsdk/core";

// Variables to be used throughout App 
// use .env for passwords and api keys
// Types start with capital letter
// Functions start with lowercase letter


export const adminTokenName: string = '41737465726961746f6b656e' // Asteriatoken
export const adminTokenPolicy: string = 'fbeafbfb456a440b174001793c546c93bdf887730c1e12b2f9f0d293' //Asteriatoken

export const fuelTokenName: AssetName = assetName("4655454c")

export const pelletRefHashWOUtil = "2f1a3220ab25f0f1a4c71ce0b9128d7dd87863625dde367c403d853ee881ba45"// Nd test validator

export const asteriaRefHashWO: string = "092fd7e67c50ad01f7df346e017dcdfb8e6d8fbefe038978e2c9a39b90a28764"// Nd test validator

export const spacetimeRefHashWOUtil = "3f4869ecd0e39b5a6320eae2cf8a85e4922b0ef10d9b2c134ab05fb90af7e3a4" //ND Test Validator


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
