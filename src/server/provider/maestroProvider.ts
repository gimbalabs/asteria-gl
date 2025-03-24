import { MaestroProvider } from "@meshsdk/core";


export const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Environment variable ${key} is not set.`);
    }
    return value;
  };

export const getMaestroApiKey = (): string => {
    return getEnv("MAESTRO_PREPROD_KEY");
  };

  const apiKey = getMaestroApiKey()

 export const maestroProvider = new MaestroProvider({
    network: "Preprod",
    apiKey: apiKey, // Get yours by visiting https://docs.gomaestro.org/docs/Getting-started/Sign-up-login.
    turboSubmit: false, // Read about paid turbo transaction submission feature at https://docs.gomaestro.org/docs/Dapp%20Platform/Turbo%20Transaction.
  });
