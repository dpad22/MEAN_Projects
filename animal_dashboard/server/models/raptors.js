const mongoose = require('mongoose')

const RaptorSchema = new mongoose.Schema({
    name: {type: String, required:true, minlength:2},
    age: {type: Number, required:true},
    sex: {type: String, required:true},
    color: {type: String, required:true, minlength:3}
}, {timestamps: true})

module.exports = {
    Raptor: mongoose.model('Raptor', RaptorSchema)
}