const express = require('express');

const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
mongoose.set('strictQuery',false);
const Campground = require('./models/campground');
const methodOverride = require('method-override');

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

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.engine('ejs',ejsMate);
//parse req.body
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

//the very basic route
app.get('/',(req,res)=>{
    res.render('home.ejs');
})

// app.get('/makecampground',async (req,res)=>{
//     //create a new campground model object
//     const camp = new Campground({title: 'My Backyard',description:'cheap camping'});
//     //save the new data to the database
//     await camp.save();
//     res.send(camp);
// })

app.get('/campgrounds',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',async(req,res)=>{
    //req.body是input的json格式，例如：{"campground":{"title":"hihi","location":"la"}}
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

//show page
app.get('/campgrounds/:id',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
})

app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});

})

app.put('/campgrounds/:id',async(req,res)=>{
    const{id}=req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})



app.listen(3000,()=>{
    console.log('Serving on port 3000');
})