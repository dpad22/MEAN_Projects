const {Raptor} = require('../models/raptors')
// bycrypt const goes here


module.exports = {
    // index route
    index: (req,res)=>{
        Raptor.find()
            .then(data =>{
                console.log(data)
                res.json(data);
            })
    },

    // home route
    home: (req,res)=>{
        Raptor.find()
        .then(raptors=>{
            res.render('home',{raptors:raptors})    
        })
    },

    // post form route
    postNew: (req,res)=>{
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
    },

    new: (req,res)=>{
        res.render('new')
    },

    destroy: (req,res)=>{
        Raptor.remove({_id:req.params.id})
        .then(()=>{
            res.redirect('/home')
        })
        .catch(err=>{
            console.log('Error eliminating raptor:', err)
        })
    },

    edit: (req,res)=>{
        Raptor.findOne({_id:req.params.id})
        .then(raptors => {
            res.render('edit.ejs',raptors)
            })
            .catch(err=>{
                res.json(err)
        })
    },

    update: (req,res)=>{
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
    },

    findRaptor: (req,res)=>{
        Raptor.findOne({_id:req.params.id})
        .then(raptors =>{
            console.log(raptors)
            res.render('raptor.ejs',raptors)
        })
        .catch(err=>{
            res.json(err)
        })
    }
}