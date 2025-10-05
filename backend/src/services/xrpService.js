// services/xrpService.js
const xrpl = require('xrpl');

class XRPService {
  constructor() {
    this.client = new xrpl.Client(process.env.XRPL_NODE_URL);
  }
  
  async initialize() {
    await this.client.connect();
  }
  
  async mintPaperNFT(paperData) {
    const transaction = {
      TransactionType: "NFTokenMint",
      Account: process.env.PLATFORM_WALLET_ADDRESS,
      NFTokenTaxon: 0, // Our papers category
      URI: xrpl.convertStringToHex(paperData.contentHash),
      Flags: xrpl.NFTokenMintFlags.tfTransferable
    };
    
    const response = await this.client.submitAndWait(transaction);
    return response.result.hash;
  }
}