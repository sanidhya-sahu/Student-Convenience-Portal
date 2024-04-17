const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    G_DP_URL : {
        type:String,
        required:true
    },
    access: {
        // admin, student, head_mess_staff, head_security_staff, head_carpainter_staff, head_service_staff, head_electrician_staff, staff
        type: String,
        required:true,
    },
    hostler : {
        type : Boolean,
        required:true,
        default:false
    },
    // block : {
    //     type:String,
    //     required:true,
    // },
}
);

const User = mongoose.model('user', userSchema);

module.exports = User