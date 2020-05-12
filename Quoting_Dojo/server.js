// imports

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');

// put session object here
app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// settings
mongoose.connect("mongodb://localhost/Quoting_Dojo", {userNewUrlParser:true})


// models go here

const UserSchema = new mongoose.Schema({
    name: {type: String, required:true, minlength:2},
    quote: {type: String, required:true, minlength:3},
    created_at:{type:Date, default:Date.now}
}, {timestamps: true})

const User = mongoose.model('User', UserSchema);

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended:true}));
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json())

// routing

app.get("/",(req, res)=>{
    res.render('welcome.ejs')
});

app.post('/process',(req,res)=>{
    const user = new User();
    user.name = req.body.name
    user.quote = req.body.quote
    user.save()  //{name:"David", age: 32}
        .then(newUser => {
            console.log("We created:", newUser)
        })
        .catch(err => {
            console.log("Error saving user:", err)
        })
        console.log(req.body)
    res.redirect('/quotes')
})

app.get("/quotes",(req, res)=>{
    User.find({}, (err,quotes)=>{
        var context = {
            quotes: quotes,
        };
        if (err){
            console.log("Error");
        }
            res.render('quotes.ejs',context)
        });
});


app.listen(1337, () => console.log("listening on port 1337. Elites only"));