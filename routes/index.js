const express = require("express")
const router = express.Router()
const uuidv4 = require('uuid/v4')
const breadcrumbs = require('express-breadcrumbs')

// Connect to database
const {
    pool
} = require('../migrations/config')

// Miscellaneous routes
router.get('/history', (request, response) => {
    request.breadcrumbs({
        name: 'Ιστορία',
        url: '/history'
    })
    response.render('pages/miscellaneous/history')
})
router.get('/business', (request, response) => {
    request.breadcrumbs({
        name: 'Για Επιχειρηματίες',
        url: '/business'
    })
    response.render('pages/miscellaneous/business')
})
router.get('/prokirikseis', (request, response) => {
    request.breadcrumbs({
        name: 'Προκυρήξεις',
        url: '/prokirikseis'
    })
    response.render('pages/miscellaneous/prokirikseis')
})
router.get('/help', (request, response) => {
    request.breadcrumbs({
        name: 'Βοήθεια',
        url: '/help'
    })
    response.render('pages/miscellaneous/help')
})
router.get('/accessibility', (request, response) => {
    request.breadcrumbs({
        name: 'ΑμεΑ',
        url: '/accessibility'
    })
    response.render('pages/miscellaneous/accessibility')
})
router.get('/contact', (request, response) => {
    request.breadcrumbs({
        name: 'Επικοινωνία',
        url: '/contact'
    })
    response.render('pages/miscellaneous/contact')
})
router.get('/ekdotiria', (request, response) => {
    request.breadcrumbs({
        name: 'Εκδοτήρια',
        url: '/ekdotiria'
    })
    response.render('pages/miscellaneous/ekdotiria')
})
router.get('/telematics', (request, response) => {
    request.breadcrumbs({
        name: 'Πληροφόρηση σε πραγματικό χρόνο',
        url: '/telematics'
    })
    response.render('pages/miscellaneous/telematics')
})
router.get('/maps', (request, response) => {
    request.breadcrumbs({
        name: 'Χάρτες',
        url: '/maps'
    })
    response.render('pages/miscellaneous/maps')
})
router.get('/nearby', (request, response) => {
    request.breadcrumbs({
        name: 'Κοντά μου',
        url: '/nearby'
    })
    response.render('pages/miscellaneous/nearby')
})
router.get('/reducedfare', (request, response) => {
    request.breadcrumbs({
        name: 'Δικαιούχοι μειωμένου κομίστρου',
        url: '/reducedfare'
    })
    response.render('pages/miscellaneous/reducedfare')
})
router.get('/news', (request, response) => {
    request.breadcrumbs({
        name: 'Ανακοινώσεις',
        url: '/news'
    })
    response.render('pages/miscellaneous/news')
})

// Root route
router.get('/', (request, response) => {
    if (!request.session.loggedin) {
        request.session.loggedin = false
    }
    response.render('pages/index')
})

// Register / Sign up route
router.get('/register', (request, response) => {
    request.breadcrumbs({
        name: 'Εγγραφή',
        url: '/register'
    })
    response.render('pages/register')
})

// handle register / sign up logic
router.post('/register', async (request, response) => {
    const {
        firstName,
        lastName,
        telephone,
        afm,
        email,
        password
    } = request.body

    // Queries
    const retrieve_query = 'SELECT id FROM "users" WHERE email=$1'
    const insert_query = 'INSERT INTO "users" (id, firstName, lastName, telephone, afm, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7)'

    // Check if email address is already used
    pool.query(retrieve_query, [email], (error, result) => {
        if (result.rows[0]) {
            request.flash('warning', "Αυτό το email έχει ήδη χρησιμοποιηθεί");
            response.redirect('/register')
        } else {
            // Insert user into users table
            pool.query(insert_query, [uuidv4(), firstName, lastName, telephone, afm, email, password], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error
                }
                console.log(result)
                request.flash('success', 'Επιτυχής εγγραφή χρήστη')
                response.redirect('/login');
            })
        }
    })
})



// Log in route
router.get('/login', (request, response) => {
    request.breadcrumbs({
        name: 'Είσοδος',
        url: '/login'
    })
    response.render('pages/login')
})

// handle log in logic
router.post('/login', (request, response) => {
    const {
        email,
        password
    } = request.body

    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2'

    if (email && password) {
        pool.query(query, [email, password], (error, result) => {
            if (result.rowCount > 0) {
                request.session.loggedin = true
                let user = {
                    id: result.rows[0].id,
                    firstName: result.rows[0].firstname,
                    lastName: result.rows[0].lastname,
                    telephone: result.rows[0].telephone,
                    afm: result.rows[0].afm,
                    email: result.rows[0].email,
                    password: result.rows[0].password
                }
                request.session.currentUser = user
                console.log("request.session.currentUser => ", request.session.currentUser)
                response.redirect('/account')
            } else {
                // incorrect email / password
                request.flash('danger', "Λάθος στοιχεία εισόδου");
                response.redirect('/login')

            }
        })
    }
})


// Log out route
router.get("/logout", (request, response) => {
    delete request.session.currentUser
    delete response.locals.currentUser
    request.session.loggedin = false
    request.flash('success', 'Αποσύνδεση επιτυχής')
    response.redirect("/")
});

module.exports = router