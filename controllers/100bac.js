const User = require("../models/user");
const {
  Class,
  Chapter,
  Subject,
  HStudent,
  HTeacher,
  HSCourseVideo,
} = require("../models/100bac");

// show serie home
module.exports.showClassHome = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id).populate("subjects");
  res.render("programs/100bac/Class/classHome", {
    schoolClass
  });
};

//student
module.exports.createHStudent = async (req, res) => {
  const user = await User.findOne({
    username: req.body.student_username
  });

  const studentClass = await Class.findOne({
    title: req.body.class,
    serie: req.body.serie
  });

  // Checking if user already has high_school status
  const checkingStudent = await HStudent.findOne({
    studentBasicInfo: user._id
  });

  if (checkingStudent) {
    req.flash('error', `${user.surname} ${user.name} a déjà un compte élève`);
    res.redirect("back");
  } else {
    // Create a new high student
    const new_highStudent = new HStudent({
      school: req.body.school,
      class: req.body.class,
      serie: req.body.serie,
      studentBasicInfo: user._id
    });

    await new_highStudent.save();

    //adding new student to its class
    studentClass.students.push(new_highStudent._id);
    await studentClass.save();

    // Adding student status to user
    user.isHighSchoolStudent = true;
    user.highSchool_id = new_highStudent._id;

    await user.save();

    req.flash('success', `Compte élève crée avec succès pour ${user.surname} ${user.name}`);
    res.redirect("back");
  }
}

//Student profile
module.exports.studentProfile = async (req, res) => {

  const student = await HStudent.findById(req.params.highSchool_id).populate("chaptersPremium").populate("homeTeacher").populate("studentBasicInfo")

  res.render("programs/100bac/student/profile", {
    student
  });
}

/* SUBJECTS */

// add a subject to a class
module.exports.addSubject = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id);
  const newSubject = new Subject(req.body.subject);
  await newSubject.save();

  schoolClass.subjects.push(newSubject._id);
  await schoolClass.save();

  res.redirect("/100bac");
};

// view a subject
module.exports.viewSubject = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id);
  const subject = await Subject.findById(req.params.subject_id).populate(
    "chapitres"
  );
  res.render("programs/100bac/Class/subjects/viewSubject", {
    schoolClass,
    subject
  });
};

// view all subjects
module.exports.viewAllSubject = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id);
  const subjects = await Subject.find({});
  res.render("programs/100bac/Class/subjects/viewAllSubject", {
    schoolClass,
    subjects,
  });
};

/* CHAPTERS */

// Show all chapters
module.exports.viewAllChapters = async (req, res) => {

  const schoolClass = await Class.findById(req.params.class_id);
  const subject = await Subject.findById(req.params.subject_id).populate("chapitres");
  res.render("programs/100bac/Class/chapters/allChapters", {
    subject,
    schoolClass
  })
};

// Create a chapter
module.exports.createChapter = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id);
  const subject = await Subject.findById(req.params.subject_id);

  const newChapter = new Chapter(req.body.chapter);
  await newChapter.save();


  subject.chapitres.push(newChapter._id);
  await subject.save();
  res.redirect("/100bac");
};

// View a chapter course
module.exports.viewChapter = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id);
  const subject = await Subject.findById(req.params.subject_id);
  const chapter = await Chapter.findById(req.params.chapter_id).populate(
    "courses"
  );

  res.render("programs/100bac/Class/chapters/viewChapter", {
    schoolClass,
    subject,
    chapter,
  });
};

// Free exercise
module.exports.viewChapterSE = async (req, res) => {
  const serie = await Class.findById(req.params.class_id);
  const subject = await Subject.findById(req.params.subject_id);
  const chapter = await Chapter.findById(req.params.chapter_id)
    .populate("starterExercise")
    .populate("CIAM_Basic")
    .populate("practiceExercises");

  res.render("programs/100bac/Class/chapters/viewChapterS-E", {
    serie,
    subject,
    chapter,
  });
};

// Premium
module.exports.viewChapterPRE = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id);
  const subject = await Subject.findById(req.params.subject_id);
  const chapter = await Chapter.findById(req.params.chapter_id)
    .populate("advanceExercise")
    .populate("nationalExams")
    .populate("CIAM_Premium")
    .populate("schoolExams");

  res.render("programs/100bac/Class/chapters/viewChapterPRE", {
    schoolClass,
    subject,
    chapter,
  });
};



// Give Premium access
module.exports.givePremiumAccess = async (req, res) => {
  const schoolClass = await Class.findById(req.params.class_id);
  const subject = await Subject.findById(req.params.subject_id);
  const chapter = await Chapter.findById(req.params.chapter_id);

  const user = await User.findOne({
    username: req.body.student_username
  });

  const user_hstudent = await HStudent.findOne({
    studentBasicInfo: user._id
  });

  if (chapter.premiumStudents.includes(user_hstudent._id)) {
    req.flash('error', 'Cet élève à déjà un accès premium');
    res.redirect("back")
  } else {
    chapter.premiumStudents.push(user_hstudent._id);
    await chapter.save()
    req.flash('success', `Accès premium accordé à ${user.surname} ${user.name}`);
    res.redirect("back")
  }
};


/*=========================================

                VIDEO CONTENT

===========================================*/
module.exports.createVideoContent = async (req, res) => {
  // const serie = await Class.findById(req.params.class_id);
  // const subject = await Subject.findById(req.params.subject_id);
  const chapter = await Chapter.findById(req.params.chapter_id)
  const newCourseContent = new HSCourseVideo(req.body.video);
  await newCourseContent.save();

  //saving according to type of videos
  if (req.body.video.videoType === "course") {
    chapter.courses.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "bonus_profs") {
    chapter.Bonus_Prof.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "starterEx") {
    chapter.starterExercise.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "advanceEx") {
    chapter.advanceExercise.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "nationalExam") {
    chapter.nationalExams.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "schoolExam") {
    chapter.schoolExams.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "practiceEx") {
    chapter.practiceExercises.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "CIAM_basic") {
    chapter.CIAM_Basic.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "CIAM_Premium") {
    chapter.CIAM_Premium.push(newCourseContent._id);
  }

  if (req.body.video.videoType === "exo_perso") {
    chapter.exo_perso.push(newCourseContent._id);
  }
  await chapter.save();

  res.redirect("/100bac");
};
//