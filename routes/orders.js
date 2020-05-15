const express = require("express")
const router = express.Router()

// Connect to database
const {
    pool
} = require('../migrations/config')

router.get('/', (request, response) => {
    if (!request.session.loggedin) {
        request.session.loggedin = false
    }
    request.breadcrumbs({
        name: 'Αγορά Εισητηρίων',
        url: '/orders'
    })
    response.render('pages/orders/ticket')
})

// CREATE - create new order
router.post('/', (request, response) => {
    const {
        eniaio,
        triimero,
        evdomadiaio,
    } = request.body
    const eniaioPrice = 1.40
    const triimeroPrice = 4.5
    const evdomadiaioPrice = 9
    let totalCost = eniaio * eniaioPrice + triimero * triimeroPrice + evdomadiaio * evdomadiaioPrice
    let order = {
        oeniaio: eniaio,
        otriimero: triimero,
        oevdomadiaio: evdomadiaio,
        total: totalCost
    }
    request.breadcrumbs({
        name: 'Καταχώρηση παραγγελίας',
        url: '/orders'
    })
    request.flash('success', 'Η παραγγελία καταχωρήθικε')
    response.render('pages/orders/confirm', {
        order: order

    })

})


module.exports = router;