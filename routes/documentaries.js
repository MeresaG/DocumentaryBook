const express = require('express');
const { status } = require('express/lib/response');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const Documentary = require('../models/Documentary');

/**
 * @desc show add page
 * @route GET /documentaries/add
 */

router.get('/add', ensureAuth, (req, res) => {
    res.render('documentaries/add');
})


/**
 * @desc process the add form
 * @route GET /documentaries
 */

 router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Documentary.create(req.body);
        res.redirect('/dashboard');
        
    } catch (error) {
        console.log(error);
        req.render('error/500');
    }
})


/**
 * @desc show all documentaries
 * @route GET /documentaries
 */

 router.get('/', ensureAuth, async (req, res) => {
    try {
        const documentaries = await Documentary.find({status:'public'})
            .populate('user')
            .sort({createdAt: 'desc'}).lean()
        res.render('documentaries/index', {
            documentaries: documentaries,
        })
    } catch (error) {
        console.error(error)
        res.send('error/500')
    }
})


module.exports = router;