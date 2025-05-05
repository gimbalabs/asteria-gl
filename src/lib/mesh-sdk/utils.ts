import { MeshWallet, BlockfrostProvider, MaestroProvider} from "@meshsdk/core";

//get blockfrost provider api key
export const blockchainProvider = new BlockfrostProvider('');
export const myWallet = new MeshWallet({
  networkId: 0, // 0: testnet, 1: mainnet
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: {
    type: 'mnemonic',
    words: [],
  },
});

export const maestroprovider = new MaestroProvider({
  network: "Preprod",
  apiKey: "",
  turboSubmit:false
});

export const blockData = await blockchainProvider.fetchLatestBlock();
export const latestSlot = blockData.slot;
export const tx_latest_posix_time = Number(latestSlot) + 600;
export const slot = Number(latestSlot);
