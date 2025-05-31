import { stringToHex } from "@meshsdk/core";

export const admintoken = {
  policyid: "fbeafbfb456a440b174001793c546c93bdf887730c1e12b2f9f0d293", 
  name:      "41737465726961746f6b656e"
};

export const refHash = "eda5d68d7f41c014c920d03d096a9e0e6f4d07e9491720675fa08f6584ebfacf"

export const prizeToken = {
    policyId: "",
    name: stringToHex("")
};

export const fuelToken = {
    policyId: "",
    name: stringToHex("FUEL")
};

export const max_speed = {
    distance: 1,
    time: 30 * 1000
};
export const ship_mint_lovelace_fee: number = 3000000;
export const max_asteria_mining: number = 50;
export const max_ship_fuel: number = 100;
export const initial_fuel: string = "30";
export const min_asteria_distance: number = 10;
export const fuel_per_step: number = 1;