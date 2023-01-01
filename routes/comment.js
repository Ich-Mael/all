const express = require("express");
const catchAsync = require("../utilities/catchAsync");
const {
  isLoggedIn,
  checkRoles,
  isVerified
} = require("../middlewares/userController");
const router = express.Router();
const User = require("../models/user");
const {
  englishClubs,
  englishClubArticles,
  englishWeeklyActivities,
  englishClubWorkersOfMonth,
  englishWeeklyLessons,
  englishClubMedia,
} = require("../models/englishClub");
const Review = require("../models/comments");

const {
  checkEnglishClubMembership,
  checkEnglishBoardMembership,
} = require("../middlewares/englishClubController");


const {
  checkProgramOwnership,
} = require("../middlewares/courseController");


module.exports = router;