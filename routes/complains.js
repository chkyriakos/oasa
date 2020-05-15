const express = require("express")
const router = express.Router()

// Connect to database
const {
    pool
} = require('../migrations/config')

router.get('/', (request, response) => {
    request.breadcrumbs({
        name: 'Φόρμα Παραπόνων',
        url: '/complains'
    })
    response.render('pages/complains/complain')
})

// CREATE - create new order
router.post('/', (request, response) => {
    const {
        firstName,
        lastName,
        telephone,
        email,
        complainBody
    } = request.body

    let complain = {
        firstName: firstName,
        lastName: lastName,
        telephone: telephone,
        email: email,
        complainBody: complainBody
    }
    console.log(complain)
    request.breadcrumbs({
        name: 'Καταχώρηση Παραπόνου',
        url: '/complains'
    })
    request.flash('success', 'Το παράπονο σας καταχωρήθικε')
    response.render('pages/complains/confirm', {
        complain: complain
    })

})


module.exports = router;