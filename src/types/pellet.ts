// server/types/pellet.ts
export type PelletDatum = {
    fuel: number;                // # fuel tokens inside this UTXO
    pos_x: number;               // datum field 1
    pos_y: number;               // datum field 2
    shipyard_policy: string;     // datum field 3 (hash of spacetime.ak)
  };
  
  export type PelletParams = PelletDatum[];   // ← this already exists