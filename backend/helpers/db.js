const mongoose = require('mongoose');
require("dotenv").config();

const mongoURL = "mongodb+srv://aneesahu4:sanidhya.09@cluster0.afmgcmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const mongoURL = "mongodb://127.0.0.1:27017/Student_Conveninace_Portal";

const connectDB = async () =>{
    try {
        await mongoose.connect(mongoURL);     
        console.log("db-/");
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;