// services/reviewService.js
class ReviewService {
  async assignReviewers(paperId, reviewerIds) {
    // Create review invitations
    const invitations = reviewerIds.map(reviewerId => ({
      paper_id: paperId,
      reviewer_id: reviewerId,
      status: 'invited'
    }));
    
    await Review.bulkCreate(invitations);
    
    // Send email notifications
    await this.notifyReviewers(reviewerIds, paperId);
  }
}