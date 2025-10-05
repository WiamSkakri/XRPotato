const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Paper = sequelize.define('Paper', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  abstract: DataTypes.TEXT,
  content_hash: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  ipfs_cid: DataTypes.STRING,
  file_url: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM(
      'draft', 'submitted', 'under_review', 
      'revision_requested', 'accepted', 'published', 'rejected'
    ),
    defaultValue: 'draft'
  },
  nft_token_id: DataTypes.STRING,
  publication_date: DataTypes.DATE,
  author_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'papers',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Paper;