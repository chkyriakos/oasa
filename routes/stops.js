const express = require("express")
const router = express.Router()

// Connect to database
const {
    pool
} = require('../migrations/config')

// INDEX - show all stops
router.get('/', (request, response) => {
    pool.query('SELECT * FROM stops', (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        console.log("\n\n RETRIEVED\n ---------\n\n", results.rows)
        request.breadcrumbs({
            name: 'Στάσεις',
            url: '/stops'
        })
        response.render('pages/stops/index', {
            stops: results.rows,
            page: 'stops'
        })
    })
})

// ACCESSIBILITY - Show all stops that support accessibility
router.get('/accessibility', (request, response) => {
    pool.query('SELECT * FROM stops WHERE accessibility=TRUE', (error, results) => {
        if (error) {
            console.log(error)
            throw error
        }
        console.log("\n\n RETRIEVED\n ---------\n\n", results.rows)
        request.breadcrumbs({
            name: 'Στάσεις με Προεξοχές',
            url: '/stops/accessibility'
        })
        response.render('pages/stops/accessibility', {
            stops: results.rows,
            page: 'stops'
        })
    })
})


// SHOW - show more info for a specific stop or all stops
router.post('/', (request, response) => {
    const {
        search_stop
    } = request.body
    const specific = 'SELECT * FROM stops WHERE sname=$1'
    const all = 'SELECT * FROM stops'
    // Decide to retrieve all stops or not
    if (search_stop === '') {
        pool.query(all, (error, results) => {
            if (error) {
                console.log(error)
                throw error
            } else {
                response.redirect('/stops')
            }
        })
    } else {
        pool.query(specific, [search_stop], (error, results) => {
            if (results.rowCount == 0) {
                request.flash('warning', "Η στάση δεν υπάρχει");
                response.redirect('back')
            } else {
                // console.log(results)
                response.redirect('/stops/' + results.rows[0].id)
            }
        })
    }
})
router.get('/:id', (request, response) => {
    const retrieveStop = 'SELECT * FROM stops WHERE id=$1'
    let stopid = request.params.id
    pool.query(retrieveStop, [stopid], (error, results) => {
        if (results.rowCount == 0) {
            request.flash('warning', "Η στάση δεν υπάρχει");
            response.redirect('/stops')
        } else {
            // console.log("retrieveRoutes:", retrieveRoutes)
            console.log("array", results.rows[0])
            request.breadcrumbs([{
                name: 'Στάσεις',
                url: '/stops'
            }, {
                name: results.rows[0].sname,
                url: '/stops/' + stopid
            }])
            response.render('pages/stops/show', {
                stop: results.rows[0]
            })
        }
    })
})







module.exports = router;