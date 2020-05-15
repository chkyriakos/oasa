const express = require("express")
const router = express.Router()

// Connect to database
const {
    pool
} = require('../migrations/config')




// Root route - show profile
router.get('/', (request, response) => {
    if (request.session.loggedin) {
        request.breadcrumbs({
            name: 'Προφίλ',
            url: '/account'
        })
        response.render('pages/users/index', {
            user: request.session.currentUser
        })
    } else {
        request.flash('warning', 'Χρειάζεται να είστε συνδεδεμένοι για αυτήν την ενέργεια')
        response.redirect('/login')
    }
})

// Edit route - edit profile
router.get('/edit', (request, response) => {
    if (request.session.loggedin) {
        request.breadcrumbs([{
            name: 'Προφίλ',
            url: '/account'
        }, {
            name: 'Επεξεργασία προφίλ',
            url: '/account/edit'
        }])
        response.render('pages/users/edit', {
            user: request.session.currentUser
        })
    } else {
        request.flash('danger', 'Απαγορεύεται η πρόσβαση')
        response.redirect('/login')
    }
})

// Update - update profile
router.put('/edit', (request, response) => {
    if (request.session.loggedin) {
        const {
            firstName,
            lastName,
            telephone,
            afm,
            email,
            password
        } = request.body
        const updateData = 'UPDATE users SET firstName = $1, lastName = $2, telephone = $3, afm = $4, email = $5 WHERE id = $6'
        if (password != request.session.currentUser.password) {
            request.flash('danger', 'Ο κωδικός που δώσατε είναι λάθος')
            response.redirect('/account/edit')
        } else {
            pool.query(updateData, [firstName, lastName, telephone, afm, email, request.session.currentUser.id], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error
                }
                request.session.currentUser.firstName = firstName
                request.session.currentUser.lastName = lastName
                request.session.currentUser.telephone = telephone
                request.session.currentUser.afm = afm
                request.session.currentUser.email = email
                console.log('result => ', result)
                request.flash('success', 'Ενημέρωση στοιχείων επιτυχής')
                response.redirect('/account');
            })
        }
    } else {
        request.flash('danger', 'Απαγορεύεται η πρόσβαση')
        response.redirect('/login')
    }
})

// Edit route - change password
router.get('/edit/pwd', (request, response) => {
    if (request.session.loggedin) {
        request.breadcrumbs([{
            name: 'Προφίλ',
            url: '/account'
        }, {
            name: 'Επεξεργασία κωδικού πρόσβασης',
            url: '/account/edit/pwd'
        }])
        response.render('pages/users/password', {
            user: request.session.currentUser
        })
    } else {
        request.flash('danger', 'Απαγορεύεται η πρόσβαση')
        response.redirect('/login')
    }
})

// Update - update password
router.put('/edit/pwd', (request, response) => {
    if (request.session.loggedin) {
        const {
            password,
            newPassword,
            newPasswordConfirm
        } = request.body
        const updateData = 'UPDATE users SET password = $1 WHERE id = $2'
        if (password != request.session.currentUser.password) {
            request.flash('danger', 'Ο κωδικός που δώσατε είναι λάθος')
            response.redirect('back')
        } else {
            pool.query(updateData, [newPassword, request.session.currentUser.id], (error, result) => {
                if (error) {
                    console.log(error)
                    throw error
                }
                request.session.currentUser.password = newPassword
                console.log('UPDATE => ', result)
                request.flash('success', 'Ενημέρωση στοιχείων επιτυχής')
                response.redirect('/account');
            })
        }
    } else {
        request.flash('danger', 'Απαγορεύεται η πρόσβαση')
        response.redirect('/login')
    }
})

// Destroy - delete user
router.delete('/', (request, response) => {
    if (request.session.loggedin) {
        const query = 'DELETE FROM users WHERE id = $1'
        pool.query(query, [request.session.currentUser.id], (error, results) => {
            if (error) {
                console.log(error)
                throw error
            }
            delete request.session.currentUser
            delete response.locals.currentUser
            request.session.loggedin = false
            request.flash('success', 'Επιτυχής διαγραφή χρήστη')
            response.redirect("/")
        })
    } else {
        request.flash('danger', 'Απαγορεύεται η πρόσβαση')
        response.redirect('/login')
    }
})

module.exports = router;