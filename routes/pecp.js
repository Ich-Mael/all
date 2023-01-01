const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const englishCoaching = require('../controllers/pecp');
const router = express.Router();


const {
    isLoggedIn,
    checkRoles,
    isVerified
} = require("../middlewares/userController");

// pecp home
router.get('/pecp', (req, res) => {
    res.render("programs/pecp/home");
});


// creating a pecp student profile
router.post('/admindashboard/pecp/student', isVerified, checkRoles("admin"), catchAsync(englishCoaching.addNewPecpStudent));

// creating a pecp coah profile
router.post('/admindashboard/pecp/coach', isVerified, checkRoles("admin"), catchAsync(englishCoaching.addNewPecpCoach));


// Pecp student profile
router.get('/user/:user_id/pecpStudentDashboard/:pecpStudent_id', isVerified, catchAsync(englishCoaching.pecpStudentDashboard));

// Pecp coach profile
router.get('/user/:user_id/pecpCoachDashboard/:pecpCoach_id', isVerified, catchAsync(englishCoaching.pecpCoachDashboard));

//Coach Assignment
router.post("/admindashboard/pecp/coach/assignment", isVerified, catchAsync(englishCoaching.pecpCoachAssignment))



//************************************************ */
//  Coach dashboard
//************************************************ */

// Schedule Conversation topic
router.post("/user/:user_id/pecpCoachDashboard/:pecpCoach_id/pecpStudent/:pecpStudent_id/schedule_topic", isVerified, catchAsync(englishCoaching.pecpCoachST))

// feedback form
router.get("/user/:user_id/pecpCoachDashboard/:pecpCoach_id/pecpStudent/:pecpStudent_id/conv/:conv_id/feedback", isVerified, catchAsync(englishCoaching.pecpConvFeedbackForm))

// feedback 
router.put("/user/:user_id/pecpCoachDashboard/:pecpCoach_id/pecpStudent/:pecpStudent_id/conv/:conv_id/feedback", isVerified, catchAsync(englishCoaching.pecpConvFeedback))

// Grade a student
router.post("/user/:user_id/pecpCoachDashboard/:pecpCoach_id/pecpStudent/:pecpStudent_id/grade", isVerified, catchAsync(englishCoaching.pecpGrade))

// Student Cv
router.post("/user/:user_id/pecpCoachDashboard/:pecpCoach_id/pecpStudent/:pecpStudent_id/cv", isVerified, catchAsync(englishCoaching.pecpStudentCv))


module.exports = router;