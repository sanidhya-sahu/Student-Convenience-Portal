const express = require('express')
const session = require('express-session')
const Complaint = require('../models/complaintSchema')
const mailer = require('../services/mailer')
const fs = require('fs')
const sendComplainEmail = mailer.sendComplainEmail
const sendReminderComplainEmail = mailer.sendReminderComplainEmail
const router = express()
const path = require('path');
const { userInfo } = require('os')
const frontPath = path.join(__dirname, '../../', 'frontend', '/')
router.use(express.static(frontPath));
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 1000 }
}))
function isLoggedIn(req, res, next) {
    req.session.loggedIn ? next() : res.redirect('/')
}
const ELECTRICITY_IDS = JSON.parse(fs.readFileSync('./data/staff.json', 'utf8')).ELECTRICITY_IDS
const WIFI_IDS = JSON.parse(fs.readFileSync('./data/staff.json', 'utf8')).WIFI_IDS
const PLUMBING_IDS = JSON.parse(fs.readFileSync('./data/staff.json', 'utf8')).PLUMBING_IDS
var resObj = new Object
router.post('/complaint', isLoggedIn, async (req, res) => {
    const complaint = new Complaint({
        "date": Date(),
        "name": req.body.name,
        "email": req.body.email,
        "location": req.body.location,
        "block": req.body.block,
        "type": req.body.type,
        "details": req.body.details
    });
    complaint.save()
        .then(async (save) => {
            switch (req.body.type) {
                case 'Electricity':
                    try{
                        await sendComplainEmail(save._id, ELECTRICITY_IDS, save.name, save.email, save.details, save.location, save.block, save.status)
                        res.redirect('/successComplaint')
                    }
                    catch{
                        res.status(401).sendFile(frontPath + 'html/errorframe.html')
                    }
                    break;
                case 'Wifi':
                    try{
                        await sendComplainEmail(save._id, WIFI_IDS, save.name, save.email, save.details, save.location, save.block, save.status)
                        res.redirect('/successComplaint')
                    }
                    catch{
                        res.status(401).sendFile(frontPath + 'html/errorframe.html')
                    }
                    break;
                case 'Plumbing':
                    try{
                        await sendComplainEmail(save._id, PLUMBING_IDS, save.name, save.email, save.details, save.location, save.block, save.status)
                        res.redirect('/successComplaint')
                    }
                    catch{
                        res.status(401).sendFile(frontPath + 'html/errorframe.html')
                    }
                    break;

                default:
                    break;
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(401).sendFile(frontPath + 'html/errorframe.html')
        })
})
router.get(`/raiseReminder`,isLoggedIn,async (req,res)=>{
    const id = req.query.id
    const user = req.session.user
    Complaint.findOne({_id:id})
    .then(async (found)=>{
        if (found.email == user.email) {
            switch (found.type) {
                case 'Electricity':
                    try{
                        await sendReminderComplainEmail(found._id, ELECTRICITY_IDS, found.name, found.email, found.details, found.location, found.block, found.status)
                        res.send(true)
                    }
                    catch{
                        res.status(401).sendFile(frontPath + 'html/errorframe.html')
                    }
                    break;
                case 'Wifi':
                    try{
                        await sendReminderComplainEmail(found._id, WIFI_IDS, found.name, found.email, found.details, found.location, found.block, found.status)
                        res.send(true)
                    }
                    catch{
                        res.status(401).sendFile(frontPath + 'html/errorframe.html')
                    }
                    break;
                case 'Plumbing':
                    try{
                        await sendReminderComplainEmail(found._id, PLUMBING_IDS, found.name, found.email, found.details, found.location, found.block, found.status)
                        res.send(true)
                    }
                    catch{
                        res.status(401).sendFile(frontPath + 'html/errorframe.html')
                    }
                    break;

                default:
                    break;
            }
        }
        else{
            res.send(false)
        }
    })
    .catch((err)=>{
        const OBJ = {
            'status':false,
            'found':'Some error occured, try again.'
        }
        res.send(OBJ)
    })
})
router.get(`/successComplaint`,isLoggedIn,async (req,res)=>{
    req.session.newComplaint = true
    res.sendFile(frontPath + 'html/complaint.html')
})
router.get(`/listComplaints`, isLoggedIn, async (req, res) => {
    if (req.session.user) {
        await Complaint.find({ email: req.session.user.email })
            .then(async (found) => {
                if (found != null) {
                    const obj = {
                        "found" : found,
                        "new" : req.session.newComplaint
                    }
                    req.session.newComplaint = false
                    res.json(obj)
                }
                else {
                    var resp = { "empty": true }
                    res.json(resp)
                }
            })
            .catch((err) => {
                res.status(401).sendFile(frontPath + 'html/errorframe.html')
            })
    }
})
router.get(`/deleteComplaint`, async (req,res)=>{
    const id = req.query.id
    const user = req.session.user
    Complaint.findOne({_id:id})
    .then((found)=>{
        if (found.email == user.email) {
            Complaint.deleteOne({_id:id})
            .then((found)=>{
                const OBJ = {
                    'status':true,
                    'found':found
                }
                res.send(OBJ)
            })
            .catch((err)=>{
                const OBJ = {
                    'status':false,
                    'found':'Unable to delete'
                }
                res.send(OBJ)
            })
        }
        else{
            const OBJ = {
                'status':false,
                'found':'Unauthorized user'
            }
            res.send(OBJ)
        }
    })
    .catch((err)=>{
        const OBJ = {
            'status':false,
            'found':'Some error occured, try again.'
        }
        res.send(OBJ)
    })
})

module.exports = router