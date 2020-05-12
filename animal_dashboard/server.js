const express = require("express");
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');



// put session object here
app.use(session({
    secret: 'clevergirl',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

// settings
mongoose.connect("mongodb://localhost/raptorDash", {userNewUrlParser:true})


// models go here

const RaptorSchema = new mongoose.Schema({
    name: {type: String, required:true, minlength:2},
    age: {type: Number, required:true},
    sex: {type: String, required:true},
    color: {type: String, required:true, minlength:3}
}, {timestamps: true})

const Raptor = mongoose.model('Raptor', RaptorSchema);

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json())

// routing

app.get("/",(req, res)=>{
    // display all raptors
    Raptor.find()
        .then(data =>{
            console.log(data)
            res.json(data);
        })
});
// homepage
app.get("/home", (req,res)=>{
    Raptor.find()
    .then(raptors=>{
        res.render('home',{raptors:raptors})    
    })
})

    // form page to enter new raptor
app.get('/raptors/new', (req,res)=>{
    res.render('new')
});

app.post('/raptors',(req,res)=>{
    const raptor = new Raptor();
    raptor.name = req.body.name
    raptor.age = req.body.age
    raptor.sex = req.body.sex
    raptor.color = req.body.color
    raptor.save()  //{name:"David", age: 32, sex: Male, color:"red"}
        .then(newRaptor => {
            console.log("We created:", newRaptor)
        })
        .catch(err => {
            console.log("Error saving Raptor:", err)
        })
        console.log(req.body)
    res.redirect('/home')
})

app.get('/raptors/:id/destroy', (req,res)=>{
    Raptor.remove({_id:req.params.id})
    .then(()=>{
        res.redirect('/home')
    })
    .catch(err=>{
        console.log('Error eliminating raptor:', err)
    })
})

app.get('/raptors/edit/:id', (req,res)=>{
    Raptor.findOne({_id:req.params.id})
    .then(raptors => {
        res.render('edit.ejs',raptors)
        })
        .catch(err=>{
            res.json(err)
    })
})

app.post('/raptors/:id', (req,res)=>{
    // console.log("in post id:", req.params.id)
    Raptor.findOne({_id:req.params.id})
    .then(raptor =>{
        raptor.name = req.body.name
        raptor.age = req.body.age
        raptor.sex = req.body.sex
        raptor.color = req.body.color
        raptor.save()
            .then(updatedRaptor =>{
                res.redirect('/raptors/'+updatedRaptor._id)
            })
        })
    .catch(err=>{
        console.log('Error saving raptor', err)
    })
})


app.get("/raptors/:id",(req, res)=>{
    Raptor.findOne({_id:req.params.id})
    .then(raptors =>{
        console.log(raptors)
        res.render('raptor.ejs',raptors)
    })
    .catch(err=>{
        res.json(err)
    })
})
        


app.listen(8000, () => console.log("listening on port 8000. Clever Girl!"));