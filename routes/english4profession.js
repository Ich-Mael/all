const express = require("express");
const router = express.Router();



//english for everybody
router.get("/englishlang4profession", (req, res) => {
    res.render("programs/englishlang4all/english4Profession/home");
});





module.exports = router;