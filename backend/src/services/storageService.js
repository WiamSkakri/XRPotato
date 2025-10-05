// services/storageService.js
class StorageService {
  async uploadPaper(fileBuffer, paperId) {
    // 1. Upload to S3
    const s3Key = `papers/${paperId}.pdf`;
    await s3.upload({ Bucket: 'scholarled', Key: s3Key, Body: fileBuffer });
    
    // 2. Upload to IPFS
    const ipfsResult = await ipfs.add(fileBuffer);
    
    // 3. Calculate hash for blockchain
    const contentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    return { s3Key, ipfsCid: ipfsResult.cid.toString(), contentHash };
  }
}