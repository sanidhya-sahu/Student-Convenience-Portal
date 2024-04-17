const express = require('express')
const session = require('express-session')
const User = require('../models/userSchema')
const fastHashCode = require('fast-hash-code')
const router = express()
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 1000 }
}))
function isLoggedIn(req, res, next) {
    req.session.loggedIn ? next() : res.redirect('/')
}
router.get('/userInfo', isLoggedIn, async (req, res) => {
    if (req.session.user) {
        const obj = {
            "found":true,
            "user":req.session.user
        }
        res.json(obj)
    }
    else{
        const obj = {
            "found":false
        }
        res.json(obj)
    }
})

module.exports = router