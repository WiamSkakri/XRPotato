// models/Transaction.js
const Transaction = sequelize.define('Transaction', {
  amount_xrp: { type: DataTypes.DECIMAL(12, 6), allowNull: false },
  payment_method: {
    type: DataTypes.ENUM('xrp_direct', 'stripe', 'institutional'),
    allowNull: false
  },
  xrpl_tx_hash: DataTypes.STRING, // Blockchain transaction ID
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  }
});