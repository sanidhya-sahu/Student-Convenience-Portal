const express = require('express')
const session = require('express-session')
const router = express()

const path = require('path');
const frontPath = path.join(__dirname, '../../', 'frontend', '/')
router.use(express.static(frontPath));

router.use(session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 1000 }
}))

function isLoggedIn(req,res,next) {
    req.session.loggedIn ? next() : res.redirect('/')
}

router.get(`/dashboard`,isLoggedIn,async (req,res)=>{
    const user = req.session.user
    switch (user.access) {
        case "student":
            res.status(200).sendFile(frontPath + 'html/home.html')
            break;
            case "staff":
            res.status(200).sendFile(frontPath + 'html/home.html')
            break;
        default:
            res.status(401).sendFile(frontPath + 'html/error.html')
            break;
    }
})

module.exports = router