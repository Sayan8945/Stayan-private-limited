const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: "https://i.pinimg.com/originals/c8/60/41/c860412b19a62118e0c1c2f4ee499f56.gif",
        set: (v) => v === ""? "https://i.pinimg.com/originals/c8/60/41/c860412b19a62118e0c1c2f4ee499f56.gif" : v ,
    }
});

userSchema.plugin(passportLocalMongoose);  //automatecally create username, pass hashing, salting
module.exports = mongoose.model("User", userSchema);