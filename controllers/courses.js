const { Course, Module, Evaluation, Grade } = require("../models/courses");
const User = require("../models/user");
const DateUtil = require('../utilities/date');

module.exports.allCourses = async (req, res) => {
  const courses = await Course.find({ isActive: true }).populate("instructors");
  res.render("courses/index", { courses });
};

module.exports.allCoursesAdmin = async (req, res) => {
  const courses = await Course.find().populate("instructors");
  res.render("courses/admin_show_all", { courses });
};

module.exports.createCourse = async (req, res) => {
  const course = new Course(req.body.course);
  const instructorsList = req.body.instructors;

  for (let property in instructorsList) {
    const instructor = await User.findOne({
      username: `${instructorsList[property]}`,
    });
    if (instructor) {
      //pushing user to instructors array
      course.instructors.push(instructor);

      // adding course to user given courses
      instructor.coursesGiven.push(course);
      await instructor.save();
    }
  }
  //saving course to database
  await course.save();
  // res.redirect(`/courses`);
  res.redirect(`/courses/${course._id}`);
};

module.exports.showCourse = async (req, res) => {
  const course = await Course.findById(req.params.course_id)
    .populate("instructors")
    .populate("modules");

    let start = DateUtil.localTime(course.session.startDate);
    let end = DateUtil.localTime(course.session.endDate);
    // let moduleReveal = DateUtil.revealTime(course.modules[0].revealDate);
  res.render("courses/show", { course, start, end  });
};

module.exports.editCourse = async (req, res) => {
  const course = await Course.findById(req.params.course_id).populate(
    "instructors"
  );
  res.render("courses/editCourse", { course});
};

module.exports.updateCourse = async(req, res)=>{
  const course = await Course.findByIdAndUpdate(req.params.course_id, {...req.body.course, session: {...req.body.session}});
  await course.save();

  res.redirect(`/courses/${course._id}`);
};

module.exports.deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.course_id);
  req.flash("success", "Course successfully deleted");
  res.redirect("/admindashboard/courses");
};
