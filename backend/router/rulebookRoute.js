const express = require('express')
const session = require('express-session')
const path = require('path');
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

router.get('/rulebook',isLoggedIn,async (req,res)=>{
    res.sendFile(frontPath + `html/rulebook.html`)    
})

router.get('/rulebookFetch',isLoggedIn, async (req, res) => {
    await fetch('../data/rulebook.json').then((data)=>{
        const responseData = JSON.parse(data)
        const response = {
            "status":true,
            "data":responseData
        }
        res.json(response)
    })
    .catch(()=>{
        const response = {
            "status":false,
            "data":NaN
        }
        res.json(response)
    })
})

module.exports = router