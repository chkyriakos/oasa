const express = require("express")
const router = express.Router()

// Connect to database
const {
    pool
} = require('../migrations/config')

// INDEX - show all routes
router.get('/', (request, response) => {
    pool.query('SELECT * FROM routes WHERE isairportroute=FALSE', (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        console.log("\n\n RETRIEVED\n ---------\n\n", results.rows)
        request.breadcrumbs({
            name: 'Δρομολόγια',
            url: '/routes'
        })
        response.render('pages/routes/index', {
            routes: results.rows,
            page: 'routes'
        })
    })
})

// 24hr - Show all 24/7 routes
router.get('/24hr', (request, response) => {
    pool.query('SELECT * FROM routes WHERE is24hr=TRUE', (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        console.log("\n\n RETRIEVED\n ---------\n\n", results.rows)
        request.breadcrumbs([{
            name: 'Δρομολόγια',
            url: '/routes'
        }, {
            name: '24ωρα δρομολόγια',
            url: '/routes/24hr'
        }])
        response.render('pages/routes/routes24', {
            routes: results.rows,
            page: 'routes'
        })
    })
})


// AIRPORT - Show all airport routes
router.get('/airport', (request, response) => {
    pool.query('SELECT * FROM routes WHERE isairportroute=TRUE', (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        console.log("\n\n RETRIEVED\n ---------\n\n", results.rows)
        request.breadcrumbs([{
            name: 'Δρομολόγια',
            url: '/routes'
        }, {
            name: 'Αεροδρομίου',
            url: '/routes/airport'
        }])
        response.render('pages/routes/routesairport', {
            routes: results.rows,
            page: 'routes'
        })
    })
})

router.post('/plan', (request, response) => {
    let {
        from,
        to
    } = request.body

    from = (from) ? from : '*'
    to = (to) ? to : '*'

    const query = 'SELECT rname FROM routes WHERE startpoint=$1 AND endpoint=$2'

    pool.query(query, [from, to], (error, results) => {
        if (results.rowCount == 0) {
            request.flash('warning', "Τα στοιχεία που δώσατε δεν επιστρέφουν κάποιο αποτέλεσμα");
            response.redirect('back')
        } else {
            console.log(results.rows[0].rname)
            response.redirect('/routes/' + results.rows[0].rname)
        }
    })
})

// SHOW - show more info for a specific route or all routes
router.post('/', (request, response) => {
    const {
        search_route
    } = request.body
    const specific = 'SELECT * FROM routes WHERE rname=$1'
    const all = 'SELECT * FROM routes'
    // Decide to retrieve all routes or not
    if (search_route === '') {
        pool.query(all, (error, results) => {
            if (error) {
                console.log(error)
                throw error
            } else {
                response.redirect('/routes')
            }
        })
    } else {
        pool.query(specific, [search_route], (error, results) => {
            if (results.rowCount == 0) {
                request.flash('warning', "Η γραμμή δεν υπάρχει");
                response.redirect('back')
            } else {
                response.redirect('/routes/' + search_route)
            }
        })
    }
})
router.get('/:route', (request, response) => {
    const retrieveRoute = 'SELECT * FROM routes WHERE rname=$1'
    let rname = request.params.route
    pool.query(retrieveRoute, [rname], (error, results) => {
        if (results.rowCount == 0) {
            request.flash('warning', "Η γραμμή δεν υπάρχει");
            response.redirect('back')
        } else {
            request.breadcrumbs([{
                name: 'Δρομολόγια',
                url: '/routes'
            }, {
                name: results.rows[0].rname + ', ' + results.rows[0].startpoint + ' - ' + results.rows[0].endpoint,
                url: '/routes/' + rname
            }])
            console.log(results.rows)
            response.render('pages/routes/show', {
                route: results.rows[0]
            })
        }
    })
})







module.exports = router;