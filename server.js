const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const util = require('util')
const unlink = util.promisify(fs.unlink)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + path.extname(file.originalname))
    }
  })
  
  const upload = multer({ 
    storage: storage,
    limits: {fileSize: 2300000}
 }).any()

 function fileFilter (file, cb) {
    const fileType = /jpg|png|jpeg|heif|heic|/
    const extname = fileType.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileType.test(file.originalname)
  }

const port = 3000

const app = express()
module.exports.handler = (event, context, callback) => {
    const handler = app;
    return handler(event, context, callback);
  };

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req,res) =>{
    res.render('index')
})
app.get("/atYourService", (req, res) => {
    res.render("atYourService"); 
})

app.get("/timeToMove", (req, res) => {
    res.render("timeToMove"); 
})

app.get("/contact", (req, res) => {
    res.render("contact"); 
})


app.post("/upload", (req,res) =>{
    upload(req, res, (err) =>{
        if(!err && req.files != ""){
            res.status(200).send()
        } else{
            res.statusMessage = (err == "Please upload images only") ? err : "Photo exeeds limt of 2.3MB"
        }
    })
})
app.listen(port, () => { 
    console.log(`server started on ${port}`)
})