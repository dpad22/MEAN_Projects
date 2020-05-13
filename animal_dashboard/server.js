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

app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json())

require('./server/config/routes.js')(app)


app.listen(8000, () => console.log("listening on port 8000. Clever Girl!"));