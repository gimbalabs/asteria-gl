
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { MeshWallet, MaestroProvider } from "@meshsdk/core";
 



export const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set.`);
    }
    return value;
  };


 
  export const createAsteria = createTRPCRouter({
        
  })
  