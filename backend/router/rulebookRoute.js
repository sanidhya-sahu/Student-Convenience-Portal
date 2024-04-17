const express = require('express')
const session = require('express-session')
const path = require('path');
const router = express()
const rulebook = require(`../data/rulebook.json`)
router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 1000 }
}))
function isLoggedIn(req, res, next) {
    req.session.loggedIn ? next() : res.redirect('/')
}
const frontPath = path.join(__dirname, '../../', 'frontend', '/')
router.use(express.static(frontPath));

router.get('/rulebook', isLoggedIn, async (req, res) => {
    res.sendFile(frontPath + `html/rulebook.html`)
})

router.get('/ruleFetch', isLoggedIn, async (req, res) => {
    const responseData = rulebook.rules
    if (responseData != "") {
        const response = {
            "status": true,
            "data": responseData
        }
        res.json(response)

    }
    else {
        const response = {
            "status": false,
            "data": NaN
        }
        res.json(response)
    }
})

module.exports = router