const mongoose = require("mongoose");
const Review = require("./review.js");
const { type } = require("express/lib/response.js");
const { number } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        require: true,
    },
    description : {
        type: String,
    },
    image : {
        url : {
            type : String,
            // default: "https://vietnamtour.in/wp-content/uploads/VNIN_backpacking-hiking-sapa-vietnam-main-image-min.jpg",
            // set: (v) => v ===""? "https://vietnamtour.in/wp-content/uploads/VNIN_backpacking-hiking-sapa-vietnam-main-image-min.jpg" : v,   //ternar operator
        },
        filename : {
            type : String,
        }
    },
    price : {
        type: Number,
        min: 0,
        default: 1000,
        set: (v) => v ===""? 1000 : v,
    },
    location: String,
    country: String,
    
    // geometry : {
    //     type: {
    //         type: String,
    //         default: "Point",
    //         require: false,
    //     },
    //     coordinates : {
    //         type: [Number],
    //         require: true,
    //     }
    // },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner:
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
})


listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})
  
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
