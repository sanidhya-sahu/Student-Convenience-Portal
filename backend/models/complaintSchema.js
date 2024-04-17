const mongoose = require('mongoose');
const { Schema } = mongoose;

const complaintSchema = new Schema({
    date:{
        type: String,
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
    location: {
        type: String,
        required: true
    },
    block: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default:"raised"
    },
}
);

const Complaint = mongoose.model('complaint', complaintSchema);

module.exports = Complaint