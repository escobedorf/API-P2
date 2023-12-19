//user - alanricardocm
//password - Ingeniero100
const mongoose = require('mongoose');
const urilocal = "mongodb://127.0.0.1:27017/test";
const uriRemota = "mongodb+srv://alanricardocm:Ingeniero100@clusterarcm.fh2coj5.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uriRemota)
const db = mongoose.connection

module.exports=mongoose;