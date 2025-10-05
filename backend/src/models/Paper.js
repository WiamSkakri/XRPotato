// models/Paper.js
const Paper = sequelize.define('Paper', {
  title: { type: DataTypes.STRING, allowNull: false },
  abstract: DataTypes.TEXT,
  content_hash: { type: DataTypes.STRING, allowNull: false }, // For blockchain verification
  ipfs_cid: DataTypes.STRING, // IPFS content identifier
  file_url: DataTypes.STRING, // S3 or storage URL
  status: {
    type: DataTypes.ENUM(
      'draft', 'submitted', 'under_review', 
      'revision_requested', 'accepted', 'published', 'rejected'
    ),
    defaultValue: 'draft'
  },
  nft_token_id: DataTypes.STRING, // XRP Ledger NFT ID
  publication_date: DataTypes.DATE
});