const express = require('express');
const passport =  require('passport');
const router = express.Router();

/**
 * @desc auth with google 
 * @route GET /auth/google
 */

router.get('/google',
passport.authenticate('google', {scope: ['profile', 'email']}));

/**
 * @desc Google with callback
 * @route GET /auth/google/callback
 */

router.get('/google/callback',
passport.authenticate( 'google', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
}));

/**
 * @desc Logout user
 *  @route /auth/logout
 */
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/');
})

module.exports = router;