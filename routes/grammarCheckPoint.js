const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Review = require("../models/comments");
const catchAsync = require("../utilities/catchAsync");



/* =================================================
 *
 *              Grammar Checkpoint
 *
 * ================================================ */
router.get(
    "/natural_english_club/grammar_checkpoint_in_on_at_prep_time", (req, res) => {
        res.render(
            "programs/englishlang4all/grammarCheckPoint/grammarCP_01.ejs"
        )
    }
);




module.exports = router;