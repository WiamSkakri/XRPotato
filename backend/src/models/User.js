// models/User.js
const User = sequelize.define('User', {
  auth0_id: { type: DataTypes.STRING, unique: true },
  email: { type: DataTypes.STRING, unique: true },
  name: DataTypes.STRING,
  wallet_address: DataTypes.STRING,
  role: { 
    type: DataTypes.ENUM('reader', 'author', 'reviewer', 'editor', 'admin'),
    defaultValue: 'reader'
  },
  institution: DataTypes.STRING,
  reputation_score: { type: DataTypes.INTEGER, defaultValue: 0 }
});