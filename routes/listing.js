const express = require("express");
const router = express.Router();
const wrapAsync = require("../utills/wrapAsync");
const Listing = require("../Models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../addMidwares.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const listingController = require("../controllers/listing.js");


router
  .route("/")
  .get(wrapAsync(listingController.index)) //index
  .post(
    validateListing,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.newForm);

router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"),wrapAsync(listingController.updateRoute))
  .delete(isLoggedIn, wrapAsync(listingController.deleteListing));

//update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateForm)
);

module.exports = router;
