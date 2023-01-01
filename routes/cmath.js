const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const router = express.Router();
const BAC = require("../controllers/cmath");

router.get("/cmath", (req, res) => {
    res.render("programs/cmath/home")
});




module.exports = router;