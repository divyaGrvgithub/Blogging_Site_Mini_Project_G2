//______________________ Import or Require Modules ________________________________

const mongoose = require('mongoose')

//____________________________ Creating Schema _____________________________________

const authorSchema = new mongoose.Schema({
   fname :{
       type : String,
       required : true,
       trim:true
   },
   lname :{
       type : String,
       required : true,
       trim:true
   },
   title : {
       type : String,
       required : true,
       enum : ["Mr", "Mrs", "Miss"]
   },
   email : {
       type : String,
       unique : true,
       required : true
   },
   password : {
       type : String,
       required : true
   }
}, {timestamps: true})

//__________________________ Exporting Author Schema ___________________________________________

module.exports = new mongoose.model('Author', authorSchema)