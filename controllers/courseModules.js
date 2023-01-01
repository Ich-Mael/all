const {
  Course,
  Module,
  EngCourseVideo,
  Practice,
  Evaluation,
  Grade
} = require("../models/courses");
const User = require("../models/user");
const DateUtil = require("../utilities/date");


// module controller
module.exports.createModule = async (req, res) => {
  const course = await Course.findById(req.params.course_id);
  const {
    title,
    willLearnModule,
    explanationText,
    moreDetails,
    revealDate,
  } = req.body.module;

  // const videoLinks = videos.split(",");

  const newModule = new Module({
    title,
    willLearnModule,
    explanationText,
    moreDetails,
    revealDate,
  });

  // saving Course New Module
  await newModule.save();

  // pushing new module in course and saving
  course.modules.push(newModule._id);

  await course.save();

  res.redirect(`/courses/${course._id}`);
};

module.exports.showModule = async (req, res) => {
  const courseModule = await Module.findById(req.params.module_id).populate("Assignment").populate("videoLinks");
  let course = await Course.findById(req.params.course_id);

  const module_number = course.modules.indexOf(req.params.module_id) + 1;

  course = await Course.findById(req.params.course_id).populate("modules", "title")

  console.log(courseModule);

  let moduleReveal = DateUtil.revealTime(courseModule.revealDate);
  displayRevealDate = DateUtil.localTime(courseModule.revealDate);
  res.render("courses/course_modules/showModule", {
    courseModule,
    course,
    module_number,
    moduleReveal,
    displayRevealDate,
  });
};

module.exports.showCourseModules = async (req, res) => {
  const course = await Course.findById(req.params.course_id).populate(
    "modules"
  );
  res.render("courses/course_modules/showCourseModules", {
    course,
  });
};

module.exports.editModule = async (req, res) => {
  const courseModule = await Module.findById(req.params.module_id);
  const course = await Course.findById(req.params.course_id);

  res.render("courses/course_modules/editModule", {
    courseModule,
    course,
  });
};

module.exports.updateModule = async (req, res) => {
  const course = await Course.findById(req.params.course_id);
  const {
    title,
    willLearnModule,
    explanationText,
    moreDetails,
    revealDate,
  } = req.body.module;



  const courseModule = await Module.findByIdAndUpdate(req.params.module_id, {
    title,
    willLearnModule,
    explanationText,
    moreDetails,
    revealDate,
  });
  await courseModule.save();

  res.redirect(`/admindashboard/courses/${req.params.course_id}/modules`);
};


// Video lesson

module.exports.addEngVideoLesson = async (req, res) => {
  const course = await Course.findById(req.params.course_id);
  const courseModule = await Module.findById(req.params.courseModule_id);

  const newEngVideo = new EngCourseVideo(req.body.engVideo);

  // saving new video
  await newEngVideo.save();

  courseModule.videoLinks.push(newEngVideo._id)

  // saving module
  await courseModule.save();

  res.redirect(`/admindashboard/courses/${req.params.course_id}/modules`);

}


// Practice exercises

module.exports.createPractice = async (req, res) => {
  const course = await Course.findById(req.params.course_id);
  const module = await Module.findById(req.params.courseModule_id);

  const {
    title,
    category,
    practice_links
  } = req.body.practice;

  const links = practice_links.split(",");

  const newPractice = new Practice({
    title,
    category,
    links
  });
  await newPractice.save();

  module.Assignment.push(newPractice._id)

  await module.save();


  res.redirect(`/admindashboard/courses/${req.params.course_id}/modules`);

};