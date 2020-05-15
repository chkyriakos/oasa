const express = require('express')
const session = require('express-session')
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const path = require('path')
const dotenv = require('dotenv')
const flash = require('connect-flash')
const breadcrumbs = require('express-breadcrumbs')
const PORT = process.env.PORT || 5000
const app = express()

// Redis set up
// let RedisStore = require('connect-redis')(session)
// let client = redis.createClient()

// Require routes
const indexRoutes = require("./routes/index")
const userRoutes = require("./routes/users")
const orderRoutes = require("./routes/orders")
const routeRoutes = require("./routes/routes")
const stopRoutes = require("./routes/stops")
const complainRoutes = require("./routes/complains")


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride("_method"))
app.use(breadcrumbs.init())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(flash())

// Set Breadcrumbs home information
app.use(breadcrumbs.setHome({
    name: 'Αρχική',
    url: '/'
}));

app.use(session({
    secret: 'Santra! Pou en to koustoumi sou?',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    }
}))
app.use((request, response, next) => {
    response.locals.loggedin = request.session.loggedin
    response.locals.currentUser = request.session.currentUser
    response.locals.warning = request.flash("warning")
    response.locals.danger = request.flash("danger")
    response.locals.success = request.flash("success")
    response.locals.breadcrumbs = request.breadcrumbs()
    next()
})


app.use("/", indexRoutes)
app.use("/account", userRoutes)
app.use("/orders", orderRoutes)
app.use("/stops", stopRoutes)
app.use("/complains", complainRoutes)
app.use("/routes", routeRoutes)

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))