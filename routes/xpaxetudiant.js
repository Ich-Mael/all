const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, checkRoles } = require('../middlewares/userController');
const { checkCourseOwnership, checkProgramOwnership } = require('../middlewares/courseController');

// xpax etudiant
router.get('/xpaxetudiant', isLoggedIn, checkProgramOwnership('xpaxetudiant'), (req, res) => {
    res.render("programs/xpaxEtudiant/home");
});



module.exports = router;
