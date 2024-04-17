const express = require('express')
const getEventData = require('../services/eventFetch')
const session = require('express-session')
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
router.get('/events',isLoggedIn, async (req, res) => {
    getEventData().then((data)=>{
        res.json(data)
    })
})

module.exports = router