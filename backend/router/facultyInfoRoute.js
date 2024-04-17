const express = require('express')
const session = require('express-session')
const path = require('path');
const facultyData = require('../data/facultyInfo.json')
const router = express()
router.use(session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 1000 }
}))
function isLoggedIn(req,res,next) {
    req.session.loggedIn ? next() : res.redirect('/')
}
const frontPath = path.join(__dirname, '../../', 'frontend', '/')
router.use(express.static(frontPath));
router.get(`/facultyInfo`,isLoggedIn,async (req,res)=>{
    res.sendFile(frontPath + `html/facultyInfo.html`)
})
router.get('/facultyInfoFetch',isLoggedIn, async (req, res) => {
    if (typeof(facultyData)=="object") {
        const response = {
            "stat":true,
            "data":facultyData
        }
        res.json(response)
    }
    else{
        const response = {
            "stat":false,
            "data":NaN
        }
        res.json(response)
    }
})

module.exports = router