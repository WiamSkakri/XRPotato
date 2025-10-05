// routes/papers.js
router.get('/papers', paperController.getPapers); // Browse papers
router.get('/papers/:id', paperController.getPaper); // Paper details
router.post('/papers', auth, paperController.createPaper); // Submit paper
router.get('/papers/:id/content', auth, paperController.getPaperContent); // Access paper

// routes/reviews.js
router.get('/papers/:id/reviews', auth, reviewController.getReviews);
router.post('/papers/:id/reviews', auth, reviewController.submitReview);

// routes/payments.js
router.post('/payments/access', auth, paymentController.requestAccess);