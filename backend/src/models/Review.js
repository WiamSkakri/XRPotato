// models/Review.js
const Review = sequelize.define('Review', {
  status: {
    type: DataTypes.ENUM('invited', 'accepted', 'declined', 'submitted'),
    defaultValue: 'invited'
  },
  recommendation: {
    type: DataTypes.ENUM('accept', 'minor_revisions', 'major_revisions', 'reject')
  },
  scores: DataTypes.JSONB, // { clarity: 4, methodology: 5, ... }
  comments: DataTypes.TEXT,
  confidential_comments: DataTypes.TEXT,
  submitted_at: DataTypes.DATE
});