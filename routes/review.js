const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utills/wrapAsync");
const Listing = require("../Models/listing.js");
const Review = require("../Models/review.js");
const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

// review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReview)
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
