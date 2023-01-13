const mongoose = require('mongoose');
//a shortcut for later
const Schema = mongoose.Schema;

//build a schema
const CampgroundSchema = new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String
});

module.exports = mongoose.model('Campground',CampgroundSchema);