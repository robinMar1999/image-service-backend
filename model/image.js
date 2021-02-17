const mongoose=require('mongoose')

const Image=mongoose.model('Image',{
  photo:{
    type:Buffer,
    required:true
  }
})

module.exports=Image