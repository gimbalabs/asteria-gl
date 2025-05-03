import { MeshWallet,BlockfrostProvider } from "@meshsdk/core";


//get blockfrost provider api key
const blockchainProvider = new BlockfrostProvider('');
const myWallet = new MeshWallet({
  networkId: 0, // 0: testnet, 1: mainnet
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: {
    type: 'mnemonic',
    words:[]
  },
});

const admintoken = {
  policyid: "f06038e916ab3f1fb15280641280f8c13cfd684f6ce31ac000ed6e8f",
  name:    "41737465726961436f696e",
}
const blockData = await blockchainProvider.fetchLatestBlock();
const latestSlot = blockData.slot;
const slot = Number(latestSlot) + 300;

export {myWallet,blockchainProvider,admintoken,slot, latestSlot};