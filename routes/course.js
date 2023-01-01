const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Courses = require('../controllers/courses');
const CourseModules = require('../controllers/courseModules');
const catchAsync = require('../utilities/catchAsync');
const {
    Course,
    EngCourseVideo,
    Module,
    Evaluation,
    Grade
} = require("../models/courses");
const {
    isLoggedIn,
    checkRoles,
    isVerified
} = require("../middlewares/userController");
const {
    checkCourseOwnership
} = require("../middlewares/courseController");



/*
 ************************* COURSES ROUTES *******************************************
 */

// All Courses route for user
router.get('/courses', Courses.allCourses);

// All Courses route for admin
router.get('/admindashboard/courses', isVerified, checkRoles("admin"), Courses.allCoursesAdmin);

//======================== ========= ============ ============= ============ =============

// Form for a new course
router.get('/admindashboard/courses/new', isLoggedIn, isVerified, checkRoles("admin"), (req, res) => {
    res.render('courses/new');
});

// Creating a new course
router.post('/admindashboard/courses', isVerified, isLoggedIn, checkRoles("admin"), catchAsync(Courses.createCourse));

// Show course content
router.get('/courses/:course_id', isLoggedIn, isVerified, checkCourseOwnership, catchAsync(Courses.showCourse));

// Edit new course
router.get("/admindashboard/courses/:course_id/edit", isVerified, isLoggedIn, checkRoles("admin"), catchAsync(Courses.editCourse));

// Updtate Course info
router.put("/admindashboard/courses/:course_id", isVerified, isLoggedIn, checkRoles("admin"), catchAsync(Courses.updateCourse));


// Edit new course
router.delete("/admindashboard/courses/:course_id", isVerified, isLoggedIn, checkRoles("admin"), catchAsync(Courses.deleteCourse));


/*
 ************************* MODULE ROUTES *******************************************
 */

// Form for a new module
// router.get('/courses/:course_id/modules/new', isVerified, isLoggedIn, checkRoles("admin"), (req, res) => {
//     res.render('courses/modules/new');
// });

// show all modules of a course
router.get('/admindashboard/courses/:course_id/modules', isVerified, isLoggedIn, checkRoles('admin'), catchAsync(CourseModules.showCourseModules));

// Creating a new module
router.post('/admindashboard/courses/:course_id/module', isVerified, isLoggedIn, checkRoles("admin"), catchAsync(CourseModules.createModule));

// Show module content
router.get('/courses/:course_id/modules/:module_id', isVerified, isLoggedIn, checkCourseOwnership, catchAsync(CourseModules.showModule));

// Edit new module
router.get("/admindashboard/courses/:course_id/modules/:module_id/edit", isVerified, isLoggedIn, checkRoles("admin"), catchAsync(CourseModules.editModule));

router.put("/admindashboard/courses/:course_id/modules/:module_id", isVerified, isLoggedIn, checkRoles("admin"), catchAsync(CourseModules.updateModule));

// Delete new module
router.delete("/admindashboard/courses/:course_id/modules/:module_id", isVerified, isLoggedIn, checkRoles("admin"), catchAsync(CourseModules.deleteModule));

/*
 ************************* Practice exercise routes *******************************************
 */

router.post('/admindashboard/courses/:course_id/modules/:courseModule_id/practice', isVerified, isLoggedIn, checkRoles("admin"), catchAsync(CourseModules.createPractice));




/*
 ************************* Practice exercise routes *******************************************
 */

router.post('/admindashboard/courses/:course_id/modules/:courseModule_id/engcoursevideo', isVerified, isLoggedIn, checkRoles("admin"), catchAsync(CourseModules.addEngVideoLesson));


/*
 ************************* EVALUATION ROUTES *******************************************
 */
// Evalution routes
router.get('/courses/:course_id/evaluations/:evaluation', isVerified, isLoggedIn, checkCourseOwnership, catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.course_id);
    const user = await User.findById(req.user._id);
    const evaluation = req.params.evaluation;
    res.send("eval page");
}));




module.exports = router;