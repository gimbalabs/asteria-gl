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

const blockData = await blockchainProvider.fetchLatestBlock();
export const time = blockData.time;
const slot = blockData.slot;
export const tx_latest_slot = Number(slot) + 600;
export const tx_earliest_slot = Number(slot) - 60;
export const tx_earliest_posix_time = time - 60 * 1000; 
