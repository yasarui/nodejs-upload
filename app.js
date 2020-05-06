const express = require("express");
const path = require("path");
const ejs = require("ejs");
const multer = require("multer");

//set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename:function(req,file,cb){
       cb(null,file.fieldname + '-' + Date.now()+path.extname(file.originalname))
    }
})

//Init upload
const upload = multer({
    storage: storage,
    limits: {
       fileSize: 10000000
    },
    fileFilter:(req,file,cb)=>{
       checkFileType(file,cb);
    }
}).single('imageUpload')

function checkFileType(file, cb){
    //Allowed extensions
    const fileTypes = /jpeg|jpg|png|gif/;
    //Check extensions
    const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    //Check mime
    const mimetype = fileTypes.test(file.mimetype);

    if(extname && mimetype){
        return cb(null,true)
    }else{
        cb('Error : Images Only')
    }
}

//Init app
const app = express();

//Setting up the public folder
app.use(express.static('./public'));

//Setting up the View Engine
app.set('view engine','ejs');

app.get("/",(req,res)=>{
     res.render("index");
});

app.post("/upload",(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{msg:err})
        }else{
           if(req.file == undefined){
               res.render('index',{msg:"Please Select a file"})
           }else{
            res.render('index', {
                msg: 'File Uploaded!',
                file: `uploads/${req.file.filename}`
              });
           }
        }
    });
});

const port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("Server is up and Running on port "+port);
});