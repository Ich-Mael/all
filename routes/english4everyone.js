const express = require("express");
const router = express.Router();



//english for everybody
router.get("/englishlang4everyone", (req, res) => {
    res.render("programs/englishlang4all/english4Everyone/home");
});




module.exports = router;