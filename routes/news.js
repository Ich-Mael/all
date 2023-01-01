const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const router = express.Router();
const {
    news,
} = require("../models/news");
const {
    isLoggedIn,
    checkRoles,
    isVerified
} = require("../middlewares/userController");

// create a new article
router.post('/admindashboard/news', isLoggedIn, isVerified, checkRoles("admin"), catchAsync(async (req, res) => {
    const newArticle = new news(req.body.news);
    await newArticle.save();
    res.redirect("/");
}));

router.get('/news/:news_id', catchAsync(async (req, res) => {
    const article = await news.findById(req.params.news_id);
    res.render('news/showArticle', {
        article
    });

}))
module.exports = router;