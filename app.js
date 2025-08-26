require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const port = 8080;
const methodOverride = require('method-override')
const Listing = require("./Models/listing");
const Review = require("./Models/review.js");
engine = require('ejs-mate');
const wrapAsync = require("./utills/wrapAsync");
const ExpressError = require("./utills/expressError");
const { rmSync } = require("fs");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");
const { parseArgs } = require("util");
const multer = require("multer");

app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', engine);

let MongoDbUrl = process.env.MONGO_DBLINK ;
main(() => console.log("connected with wanderlust")).catch(err => console.log(err));
async function main() {
  await mongoose.connect(MongoDbUrl);
}

//mongo store
const store = MongoStore.create({
  mongoUrl: MongoDbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", ()=> {
  console.log("error in mongo session store", err);
})
// session
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days in minisec
    maxAge:  7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
}
app.use(session(sessionOptions));
app.use(flash()); // routers should load after flash

// passport
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=> {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");    // local variables
  // console.log(res.locals.error);
  // console.log(req.user);
  res.locals.currUser = req.user;
  res.locals.currRoute = "route";  // for searchbar hide

  // console.log(res.locals);
  next();
})

// app.get("/demouser", async (req,res)=>{
//   let fakeuser = new User({
//     email: "sayanpub2020@gmail.com",
//     username: "Hello sayan",
//   });
//   let registerUser = await User.register(fakeuser, "sayan292929");
//   res.send(registerUser);

// })

// router
app.get("/", (req,res) => {
  res.locals.currRoute = "/";
  res.redirect("/listings");
})
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// error handling
app.use("/", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"))
})
app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong !"} = err;
  console.log(err);
  res.status(statusCode).render("error.ejs", {message});
})

// console.log(process.versions);
app.listen(port, (req,res)=>{
  console.log("listening to port 8080...");
})
