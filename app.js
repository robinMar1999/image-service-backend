const express=require('express')
const Image=require('./model/image')
const bodyParser=require('body-parser')
const sharp=require('sharp')
const multer=require('multer')
const { isValidObjectId } = require('mongoose')
const cors=require('cors')
require('./db/mongoose')

const app=express()
const port=3000

app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))

const upload=multer({
  limits:{
    fileSize:10000000000000000000000,
    fieldSize:8 * 1024 * 1024
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return cb(new Error('Please upload an image'))
    }
    cb(undefined,true)
  }
})


app.get('/',async (req,res)=>{
  res.redirect('/images')
})

app.get('/images',async (req,res)=>{
  const allImages=await Image.find()
  const imageIDs=[]
  allImages.forEach(image=>{
    imageIDs.push({_id:image._id})
  })
  res.set('Access-Control-Allow-Origin','*')
  res.set('Content-Type','application/json')
  res.send(JSON.stringify(imageIDs))
})

app.get('/images/:id',async (req,res)=>{
  const _id=req.params.id
  if(!isValidObjectId(_id)){
    return res.status(404).send()
  }
  try{
    const image=await Image.findOne({_id})
    if(!image){
      return res.status(404).send()
    }
    res.set('Content-Type','image/png')
    res.send(image.photo)
  } catch(e){
    res.status(404).send()
  }
})

app.post('/images',upload.single('photo'),async (req,res)=>{
  const buffer=await sharp(req.file.buffer).resize({width:2000}).png().toBuffer()
  // const buffer=await sharp(req.file.buffer).png().toBuffer()
  req.body.photo=buffer
  const image=new Image(req.body)
  try{
    await image.save()
    res.status(204).send()
  } catch(e){
    res.status(400).send()
  }  
})
 
app.delete('/images/:id',async (req,res)=>{
  const _id=req.params.id
  if(!isValidObjectId(_id)){
    // res.set('Access-Control-Allow-Origin','*')
    return res.status(404).send()
  }
  try{
    const image=await Image.findById(_id)
    if(!image){
      // res.set('Access-Control-Allow-Origin','*')
      return res.status(404).send()
    }
    await image.remove()
    // res.set('Access-Control-Allow-Origin','*')
    res.status(204).send()
  } catch(e){
    // res.set('Access-Control-Allow-Origin','*')
    res.status(404).send()
  }
})

app.listen(port,()=>{
  console.log('Server is started on port',port);
})