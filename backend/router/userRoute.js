require('dotenv').config()
const express = require('express')
const session = require('express-session')
const { google } = require('googleapis')
const path = require('path');
const getUserInfo = require('../services/userInfo')
const User = require('../models/userSchema')
const fastHashCode = require('fast-hash-code')
const fs = require('fs')

const router = express()

const frontPath = path.join(__dirname, '../../', 'frontend', '/')
router.use(express.static(frontPath));

router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 1000 }
}))

const CLIENT_ID = process.env.CLIENT_ID
const SECRET_ID = process.env.SECRET_ID
const REDIRECT = process.env.REDIRECT
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, SECRET_ID, REDIRECT)
var token = ""
const staffList = JSON.parse(fs.readFileSync('./data/staff.json', 'utf8')).STAFF_IDS
const hostelersList = JSON.parse(fs.readFileSync('./data/hostelers.json', 'utf8')).emails

function isLoggedIn(req, res, next) {
    req.session.loggedIn ? next() : res.redirect('/')
}

router.get(`/`, async (req, res) => {
    res.sendFile(frontPath + `html/login.html`)
})

router.get(`/login`, async (req, res) => {
    try {
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/gmail.readonly']
        })
        res.redirect(url)
    }
    catch (err) {
        res.status(401).sendFile(frontPath + 'html/error.html')
    }
})

router.get(`/redirect`, async (req, res) => {
    const code = req.query.code
    oauth2Client.getToken(code, async (err, tokens) => {
        if (err) {
            res.status(401).sendFile(frontPath + 'html/error.html')
        }
        token = tokens
        oauth2Client.setCredentials(tokens)
        req.session.loggedIn = true
        req.session.newReg = false
        const userInfo = await getUserInfo(tokens)
        if (userInfo.status == true) {
            await User.findOne({ userId: fastHashCode.fastHashCode(userInfo.user.email) })
                .then(async (found) => {
                    if (found != null) {
                        User.updateOne({ userId: fastHashCode.fastHashCode(userInfo.user.email) }, { $set: { "G_DP_URL": userInfo.user.picture, "name": userInfo.user.name, "hostler": hostelersList.includes(userInfo.user.email) ? true : false } })
                            .then((u) => {
                                req.session.user = found
                                res.redirect('dashboard')
                            })
                            .catch(() => {
                                req.session.user = found
                                res.redirect('dashboard')
                            })
                    }
                    else {
                        req.session.newReg = true
                        res.redirect('newUser')
                    }
                })
                .catch((err) => {
                    res.status(401).sendFile(frontPath + 'html/error.html')
                })
        }
        else {
            res.status(401).sendFile(frontPath + 'html/error.html')
        }
    });

})

function isNewReg(req,res,next) {
    req.session.newReg ? next() : res.redirect('/')
}
router.get(`/newUser`,isLoggedIn,isNewReg,(req,res)=>{
    res.sendFile(frontPath + `html/newUser.html`)
})
router.get(`/newUserDetails`, isLoggedIn,isNewReg, async (req,res)=>{
    const userInfo = await getUserInfo(token)
    const userObj = {
        "email": userInfo.user.email,
        "name": userInfo.user.name,
        "G_DP_URL": userInfo.user.picture,
        "hostler": hostelersList.includes(userInfo.user.email) ? true : false,
        "access": staffList.includes(userInfo.user.email) ? "staff" : "student"
    }
    res.json(userObj)
})
router.post(`/newUser`,isLoggedIn,isNewReg,async (req,res)=>{
    const userInfo = await getUserInfo(token)
    var userObject = {
        "userId": fastHashCode.fastHashCode(userInfo.user.email),
        "email": userInfo.user.email,
        "name": userInfo.user.name,
        "gender": req.body.gender,
        "G_DP_URL": userInfo.user.picture,
        "hostler": hostelersList.includes(userInfo.user.email) ? true : false,
        "access": staffList.includes(userInfo.user.email) ? "staff" : "student"
    }
    const user = new User({
        ...userObject
    });
    user.save()
        .then((save) => {
            req.session.user = save
            req.session.newReg = false
            res.redirect('dashboard')
        })
        .catch(() => {
            res.status(401).sendFile(frontPath + 'html/error.html')
        })
})


router.get('/logout', async (req, res) => {
    req.session.destroy(async err => {
        if (err) {
            res.status(401).sendFile(frontPath + 'html/error.html')
        } else {
            try {
                oauth2Client.revokeToken({ token: token }, () => {
                    res.redirect('/');
                });
            } catch (err) {
                res.status(401).sendFile(frontPath + 'html/error.html')
            }
        }
    });
});

router.get(`/errorframe`, isLoggedIn, (req, res) => {
    res.status(401).sendFile(frontPath + 'html/errorframe.html')
})

module.exports = router