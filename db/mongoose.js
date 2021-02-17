const mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/image-service',{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true,
  useFindAndModify:false,
  autoIndex:true
})