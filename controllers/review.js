const Listing = require("../Models/listing");
const Review = require("../Models/review");

module.exports.addReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review); //convert into schema format
  //author
  newReview.author = req.user._id;
  // console.log(req.user);
  // console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save(); //existing document change
  req.flash("success", "New Review added!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
