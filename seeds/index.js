


const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Campground = require('../models/campground')


//connect to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',
{   
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useUnifiedTopology:true 
});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

//the way to pick up a random element in an array
//array[Math.floor(Math.random()*array.length)]
const sample = array=>array[Math.floor(Math.random()*array.length)];

//remove everything in from the database
const seedDB = async()=>{
    //clear everything, and make a new campground
    await Campground.deleteMany({});
    //create 50 new campgrounds
    for(let i = 0;i<50;i++){
       const priceNew = Math.floor(Math.random()*20)+10;
       const random1000 = Math.floor(Math.random()*1000);
       const camp =  new Campground({
            location:`${cities[random1000].city},${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://unsplash.com/photos/ls1WJjYg070',
            // 'https://api.unsplash.com/photos/?'
            price:priceNew
        })
        
        await camp.save();
    }

}
seedDB().then(()=>{
    //close the database
    mongoose.connection.close();
})