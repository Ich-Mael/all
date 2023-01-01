const express = require('express');
const catchAsync = require('../utilities/catchAsync');
const router = express.Router();
const BAC = require("../controllers/100bac");

// const { Class, Chapitre, Subject } = require("../models/100bac");
const {
    isLoggedIn,
    checkRoles,
    isVerified
} = require("../middlewares/userController");
const {
    checkCourseOwnership,
    checkProgramOwnership
} = require('../middlewares/courseController');

const {
    facebookPageLike,
    classCheck,
    chapterPremiumAccess
} = require('../middlewares/mathsController');

// Operation 100% BAC
router.get('/100bac', catchAsync(async (req, res) => {
    const allClassesD = await Class.find({
        serie: "D"
    });


    res.render("programs/100bac/home", {
        allClassesD
    });
}));

//view series and classes
router.get('/admindashboard/100bac/series_and_classes', isVerified, checkRoles("admin"), catchAsync(async (req, res) => {
    const schoolClassesD = await Class.find({});
    res.render("programs/100bac/allClasses", {
        schoolClassesD
    });
}));

// create a new class
router.post('/admindashboard/100bac/class', isVerified, checkRoles("admin"), catchAsync(async (req, res) => {
    const newClass = new Class(req.body.class);
    await newClass.save();
    res.redirect("/100bac");
}));

// Show create student
router.post('/admindashboard/100bac/class/newHighschoolStudent', isVerified, checkRoles("admin"), catchAsync(BAC.createHStudent));

//student profile
router.get('/user/:user_id/highschoolDashboard/:highSchool_id', isVerified, catchAsync(BAC.studentProfile));

// Show class home
router.get('/100bac/class/:class_id', catchAsync(BAC.showClassHome));

//=================== Subject ========================

// Create a new subject form
router.get('/admindashboard/100bac/class/:class_id/subject/new', checkRoles("admin"), catchAsync(async (req, res) => {
    const schoolClass = await Class.findById(req.params.class_id);
    res.render("programs/100bac/Class/subjects/newSubject", {
        schoolClass
    });
}));

// Create a new subject
router.post('/admindashboard/100bac/class/:class_id/subject', isLoggedIn, isVerified, checkRoles("admin"), catchAsync(BAC.addSubject));

// View subject
router.get('/100bac/class/:class_id/subject/:subject_id', isLoggedIn, isVerified, facebookPageLike, classCheck, catchAsync(BAC.viewSubject));

// View all subject by admin
router.get('/admindashboard/100bac/class/:class_id/subjects', checkRoles("admin"), catchAsync(BAC.viewAllSubject));

// Cours Maths Tle D

// ======================== Chapters ===================== 

// Create a new chapter form
router.get('/admindashboard/100bac/class/:class_id/subject/:subject_id/chapter/new', isVerified, checkRoles("admin"), catchAsync(async (req, res) => {
    const schoolClass = await Class.findById(req.params.class_id);
    const subject = await Subject.findById(req.params.subject_id);
    res.render("programs/100bac/Class/chapters/newChapter", {
        schoolClass,
        subject
    });
}));

// Create a new chapter 
router.post('/admindashboard/100bac/class/:class_id/subject/:subject_id/chapter', isVerified, checkRoles("admin"), catchAsync(BAC.createChapter));

// View all chapters by admin
router.get('/admindashboard/100bac/class/:class_id/subject/:subject_id/chapters', isVerified, checkRoles("admin"), catchAsync(BAC.viewAllChapters));

//view a chapter
router.get('/100bac/class/:class_id/subject/:subject_id/chapter/:chapter_id', isLoggedIn, isVerified, facebookPageLike, classCheck, catchAsync(BAC.viewChapter));

//Starter exercises 
router.get('/100bac/class/:class_id/subject/:subject_id/chapter/:chapter_id/SE', isLoggedIn, isVerified, facebookPageLike, classCheck, catchAsync(BAC.viewChapterSE));

//Premium content
router.get('/100bac/class/:class_id/subject/:subject_id/chapter/:chapter_id/PRE', isLoggedIn, isVerified, classCheck, chapterPremiumAccess, catchAsync(BAC.viewChapterPRE));

//Give Premium access
router.post('/admindashboard/100bac/class/:class_id/subject/:subject_id/chapter/:chapter_id/givepremiumaccess', isVerified, checkRoles("admin"), catchAsync(BAC.givePremiumAccess));


//========================= Video content =================//
// Create a new video content form
router.post('/admindashboard/100bac/class/:class_id/subject/:subject_id/chapter/:chapter_id/videocontent', isVerified, checkRoles("admin"), catchAsync(BAC.createVideoContent));


module.exports = router;