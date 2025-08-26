const Listing = require("./Models/listing");
const Review = require("./Models/review");
const ExpressError = require("./utills/expressError");
const { listingValidate, reviewValidate } = require("./schema");

module.exports.isLoggedIn = (req,res,next) => {
    if( ! req.isAuthenticated()) {
      // redirect to url
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be logged in!");
      return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner = async (req,res,next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have accesss of this content");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req, res, next) => {
  let result = listingValidate.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let result = reviewValidate.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req,res,next) => {
  let {id , reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have accesss of this content");
    return res.redirect(`/listings/${id}`);
  }
  next();
}