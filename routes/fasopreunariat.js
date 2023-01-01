const express = require('express');
const router = express.Router();
const { isLoggedIn, checkRoles, isVerified } = require('../middlewares/userController');
const { checkCourseOwnership } = require('../middlewares/courseController');


//english for everybody
router.get('/fasopreunariat', (req, res) => {
    res.render("comingsoon");
});

module.exports = router;