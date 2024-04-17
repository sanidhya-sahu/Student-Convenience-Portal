const express = require('express')
const session = require("express-session");
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoute = require('./router/userRoute')
const dashboard = require('./router/dashboard')
const eventRoute = require('./router/eventRoute')
const rulebookRoute = require('./router/rulebookRoute')
const facultyInfoRoute = require('./router/facultyInfoRoute')
const profileRoute = require('./router/profileRoute')
const complaintRoute = require('./router/complaintRoute')
const connectDB = require('./helpers/db')
connectDB()

const app = express()
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60 * 60 * 1000 }
}))
app.use(cors())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
})
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`/`, userRoute, dashboard, eventRoute, rulebookRoute, facultyInfoRoute,profileRoute,complaintRoute)

const server = app.listen(80, () => {
    console.log("running on http://127.0.0.1")
})