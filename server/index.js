const mongoose=require('mongoose');
const express=require('express');
const app=express();
const cookieParser = require("cookie-parser");


mongoose.connect("mongodb://127.0.0.1:27017/perfectpartner")
.then(()=>console.log("connection established"))
.catch((err)=>console.log(err));


app.use(express.json());
app.use(cookieParser());
app.use('/public',express.static("public"));
app.use(require('./routes/auth'));
app.listen(5000,()=>{console.log("Server started")});
