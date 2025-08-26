const Listing = require("../Models/listing");
const { googleMapKey, geocodeAddress} = require("../map");


module.exports.index = async (req, res) => {
  res.locals.currRoute = "/";
  let allListings = await Listing.find({}).sort({ title: 1 });
  res.render("listings", { allListings });
};

module.exports.newForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res) => {
  // image
  let url = req.file.path;
  let filename = req.file.filename;

  let newlisting = req.body.listing;
  newlisting.owner = req.user._id;
  newlisting.image = {url,filename};

  await Listing.insertOne(newlisting);
  console.log(newlisting);
  req.flash("success", "New Listing created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  let listingAdress = `${listing.location}, ${listing.country}`;
  let location = await geocodeAddress(listingAdress);
  // console.log(listingAdress);
  // console.log(location);
  if (!listing) {
    req.flash("error", "Listing doesn't exist!");
    res.redirect("/listings");
  } else {
    res.render("listings/show", { listing, location, googleMapKey});
    // console.log(res.locals);
  }
};
module.exports.updateForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  let imageUrl = listing.image.url;
  // console.log(imageUrl);
  // imageUrl = imageUrl.replace("/upload", "/upload/h_200,w_250");
  res.render("listings/edit", { listing, imageUrl });
};
module.exports.updateRoute = async (req, res) => {
  let { id } = req.params;
  // let editedlisting = req.body.listing;
  let listing = await Listing.findByIdAndUpdate(id, req.body.listing);

  if (req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
  }
  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedlist = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  // console.log(deletedlist);
  res.redirect(`/listings`);
};
