const xrpl = require('xrpl');

class XRPService {
  constructor() {
    this.client = null;
    this.wallet = null;
  }
  
  async initialize() {
    // Connect to XRP Testnet
    this.client = new xrpl.Client(process.env.XRPL_TESTNET_URL || 'wss://s.altnet.rippletest.net:51233');
    await this.client.connect();
    
    // Platform wallet for minting NFTs
    this.wallet = xrpl.Wallet.fromSeed(process.env.XRP_WALLET_SECRET);

    console.log('✅ XRP Wallet loaded:', this.wallet.address);
    console.log('client',this.client);
    
    console.log('✅ XRP Ledger connected');
  }
  
  async mintPaperNFT(paperData) {
    try {
      // Prepare NFT mint transaction
      const transaction = {
        TransactionType: "NFTokenMint",
        Account: this.wallet.address,
        NFTokenTaxon: 0, // Category for academic papers
        URI: xrpl.convertStringToHex(JSON.stringify({
          content_hash: paperData.contentHash,
          title: paperData.paperMetadata.title,
          authors: paperData.paperMetadata.authors,
          timestamp: new Date().toISOString()
        })),
        Flags: xrpl.NFTokenMintFlags.tfTransferable,
        Fee: "12000" // Network fee in drops
      };
      
      // Submit transaction
      const prepared = await this.client.autofill(transaction);
      console.log('Prepared transaction:', prepared);
      const signed = this.wallet.sign(prepared);
        console.log('Signed transaction:', signed);
      const result = await this.client.submitAndWait(signed.tx_blob);
        console.log('Transaction result:', result);
        console.log('Transaction metadata:', result.result.meta.AffectedNodes );
      
      if (result.result.meta.TransactionResult === "tesSUCCESS") {
        // Extract NFT token ID from transaction metadata
        const nftokenID = this.extractNFTokenID(result.result.meta);
        
        return {
          success: true,
          tokenId: nftokenID,
          txHash: result.result.hash,
          explorerUrl: `https://testnet.xrpl.org/transactions/${result.result.hash}`
        };
      } else {
        throw new Error(`NFT mint failed: ${result.result.meta.TransactionResult}`);
      }
      
    } catch (error) {
      console.error('XRP NFT minting error:', error);
      throw error;
    }
  }
  
  extractNFTokenID(meta) {
    // Extract NFTokenID from transaction metadata
     if (meta.AffectedNodes) {
        for (const node of meta.AffectedNodes) {
            console.log('Node type:', Object.keys(node)[0]);
        
            // Check ModifiedNode (NFT added to existing page)
            if (node.ModifiedNode && node.ModifiedNode.LedgerEntryType === 'NFTokenPage') {
                console.log('📄 Found Modified NFTokenPage');
                
                // Look for new NFTs in the FinalFields
                if (node.ModifiedNode.FinalFields && node.ModifiedNode.FinalFields.NFTokens) {
                const finalTokens = node.ModifiedNode.FinalFields.NFTokens;
                console.log('FinalFields NFTs:', finalTokens);
                
                // Compare with PreviousFields to find the new one
                if (node.ModifiedNode.PreviousFields && node.ModifiedNode.PreviousFields.NFTokens) {
                    const previousTokens = node.ModifiedNode.PreviousFields.NFTokens;
                    console.log('PreviousFields NFTs:', previousTokens);
                    
                    // Find the token that's in FinalFields but not in PreviousFields
                    for (const token of finalTokens) {
                    const wasInPrevious = previousTokens.some(prevToken => 
                        prevToken.NFToken.NFTokenID === token.NFToken.NFTokenID
                    );
                    
                    if (!wasInPrevious) {
                        console.log('🎉 Found new NFTokenID:', token.NFToken.NFTokenID);
                        return token.NFToken.NFTokenID;
                    }
                    }
                }
                
                // If we can't compare, just take the first one
                if (finalTokens.length > 0) {
                    console.log('⚠️ Using first NFT from FinalFields:', finalTokens[0].NFToken.NFTokenID);
                    return finalTokens[0].NFToken.NFTokenID;
                }
                }
            }
        
        // Also check CreatedNode (brand new NFTokenPage)
            if (node.CreatedNode && node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
                console.log('🆕 Found Created NFTokenPage');
                const tokens = node.CreatedNode.NewFields.NFTokens;
                if (tokens && tokens.length > 0) {
                console.log('🎉 Found NFTokenID in CreatedNode:', tokens[0].NFToken.NFTokenID);
                return tokens[0].NFToken.NFTokenID;
                }
            }
        }
    }
    throw new Error('NFTokenID not found in transaction');
  }
  
  async verifyPaperNFT(paperId, contentHash) {
    // Verify that the NFT exists and matches the content hash
    const paper = await PaperService.getPaper(paperId);
    
    if (!paper.nft_token_id) {
      return { verified: false, reason: 'No NFT associated' };
    }
    
    // Look up NFT on XRP Ledger
    const nftInfo = await this.getNFTokenInfo(paper.nft_token_id);
    
    // Verify content hash matches
    const nftData = JSON.parse(xrpl.convertHexToString(nftInfo.URI));
    const hashMatches = nftData.content_hash === contentHash;
    
    return {
      verified: hashMatches,
      nftData: nftData,
      onChain: true,
      match: hashMatches
    };
  }
  
  async getNFTokenInfo(tokenId) {
    const request = {
      command: "account_nfts",
      account: this.wallet.address,
      nft_id: tokenId
    };
    
    const response = await this.client.request(request);
    return response.result.account_nfts[0];
  }
}

module.exports = new XRPService();