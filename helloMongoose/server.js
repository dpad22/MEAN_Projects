// imports

const express = require("express");
const app = express();
const mongoose = require('mongoose');

// put session object here


// settings
mongoose.connect("mongodb://localhost/helloMongo", {userNewUrlParser:true})


// models go here

const UserSchema = new mongoose.Schema({
    name: String,
    age: Number
})

const User = mongoose.model('User', UserSchema)

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended:false}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json())



// routing

app.get("/",(req, res)=>{
    User.find()
        .then(data=>{
            res.json(data)
        })
        .catch(err =>{
            res.json(err)
        })

})

app.get("/users",(req, res)=>{
    res.render('index.ejs')

})

app.get("/users/:id", (req,res)=>{
    User.findOne({_id:req.params.id})
    .then(data=> {
        res.json(data)
    })
    .catch(err=>{
        res.json(err)
    })
})

// delete user

app.get('/users/:id/destroy', (req,res)=>{
    User.remove({_id:req.params.id})
    .then(()=>{
        res.redirect('/')
    })
    .catch(err=>{
        console.log('Error destroying user:', err)
    })
})

// edit user

app.get('/users/:id/edit', (req,res)=>{
    User.findOne({_id:req.params.id})
    .then(data => {
        res.render('edit.ejs',data)
        })
        .catch(err=>{
            res.json(err)
    })
})

// create user

app.post('/users/:id', (req,res)=>{
    User.findOne({_id:req.params.id})
    .then(user =>{
        user.name = req.body.name
        user.age = req.body.age
        user.save()
            .then(updatedUser =>{
                res.redirect('/users/'+updatedUser._id)
            })
        })
    .catch(err=>{
        console.log('Error saving user', err)
    })
})


app.post('/users',(req,res)=>{
    const user = new User();
    user.name = req.body.name
    user.age = req.body.age
    user.save()  //{name:"David", age: 32}
        .then(newUser => {
            console.log("We created:", newUser)
        })
        .catch(err => {
            console.log("Error saving user:", err)
        })
    res.redirect('/')
})



app.listen(1337, () => console.log("listening on port 1337. Elites only"));