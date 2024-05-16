const express = require("express")
const multer = require("multer")
const AWS = require("aws-sdk")
const multerS3 = require("multer-s3-v2")
const path = require("path")
require("dotenv").config()

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
})
const s3Bucket = new AWS.S3()

const {s3} = require("./s3.js")
const { url } = require("inspector")

const storage = multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    metadata: function(req, file, cb) {
      cb(null, { originalname: file.originalname });
    },
    key: function(req, file, cb) {
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
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get("/", (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get("/atYourService", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'atYourService.html'))
});

app.get("/timeToMove", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'timeToMove.html'))
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'))
});
app.get("/video", (req, res) => {
    const videoPath = path.join(__dirname, "public", "videos", "d3sVid.mp4");
    res.sendFile(videoPath);
});

app.get("/uploaded", (req, res) => {
    const cutoffTime = new Date(Date.now() - 5 * 60 * 1000);

    const params = {
        Bucket: process.env.BUCKET_NAME
    };

    s3Bucket.listObjectsV2(params, (err, data) => {
        if (err) {
            console.error('Error listing objects in S3 bucket:', err);
            return res.status(500).json({ error: 'Error listing objects in S3 bucket' });
        }
        const recentObjects = data.Contents.filter(obj => obj.LastModified > cutoffTime);

        if (recentObjects.length === 0) {
            return res.status(404).json({ error: 'No recent objects found in the S3 bucket' });
        }
        
        const recentObjectURLs = recentObjects.map(obj => `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${obj.Key}`);
        

        res.status(200).json(recentObjectURLs);
    });
});




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