const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment"); // require

/*===================================
             High School
===================================*/
const HighSchoolSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  founded: {
    type: String,
    required: true,
  },

  area: {
    type: String,
    required: true,
  },

  students: [{
    type: Schema.Types.ObjectId,
    ref: "HStudent",
  }, ],
}, {
  timestamps: true,
});

/*=================================
                Student
===================================*/
const HStudentSchema = new Schema({
  serie: {
    type: String,
    required: true,
  },

  class: {
    type: String,
  },

  academicYear: {
    type: String,
  },

  missionStatement: {
    type: String,
  },

  school: {
    type: String,
  },

  parentsInfo: {
    type: String,
  },

  neighborhood: {
    type: String,
  },

  parentsContact: {
    type: String,
  },

  practiceSTeacher: [{
    type: String,
  }],

  knowledgeCheckExams: [{
    type: String,
  }],

  personalizedAdvice: [{
    Title: String,
    content: String,
  }],

  hasAHomeTeacher: {
    type: Boolean,
    default: false,
  },

  hasAPremiumContent: {
    type: Boolean,
    default: false,
  },

  mathsGrade: [{
    period: String,
    grade: Number
  }],

  chaptersPremium: [{
    type: Schema.Types.ObjectId,
    ref: "Chapter",
  }, ],

  studentBasicInfo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  premiumContent: {
    type: Schema.Types.ObjectId,
    ref: "PremiumContent",
  },

  homeTeacher: [{
    type: Schema.Types.ObjectId,
    ref: "HTeacher",
  }, ],

}, {
  timestamps: true,
});

/*=================================
             Home Teacher
===================================*/
const homeTeacherSchema = new Schema({
  homeTeacherBasicInfo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  occupation: {
    type: String,
  },

  work_areas: [{
    type: String,
  }],

  subject: [{
    type: String,
  }],

  students: [{
    type: Schema.Types.ObjectId,
    ref: "HStudent",
  }, ],

  introVideolink: {
    type: String,
  }

}, {
  timestamps: true,
});

/*================================
              Class
===================================*/
const classSchema = new Schema({
  title: {
    type: String,
    required: true,
    enum: ["Seconde", "Premiere", "Terminale", "Troisieme", "Quatrieme", "Cinquieme", "Sixieme"]
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  serieImageUrl: {
    type: String,
    default: "",
  },

  serie: {
    type: String,
    enum: ["D", "C", "A", "G2", "F3", "Collège", "Primaire"]
  },

  subjects: [{
    type: Schema.Types.ObjectId,
    ref: "Subject",
  }, ],

  students: [{
    type: Schema.Types.ObjectId,
    ref: "HStudent",
  }, ],

}, {
  timestamps: true,
});

/*===================================
                Subject
===================================*/
const subjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  aboutVideoLink: {
    type: String,
  },

  subjectImageUrl: {
    type: String,
    default: "",
  },

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }, ],

  chapitres: [{
    type: Schema.Types.ObjectId,
    ref: "Chapter",
  }, ],

  students: [{
    type: Schema.Types.ObjectId,
    ref: "HStudent",
  }, ],
});

/*===================================
          chapter
===================================*/
const chapterSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  aboutLink: {
    type: String,
    default: ""
  },

  chapterImageUrl: {
    type: String,
    default: "",
  },

  premiumPrice: {
    type: String,
    default: "2000",
  },

  premiumStudents: [{
    type: Schema.Types.ObjectId,
    ref: "HStudent",
  }, ],

  courses: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  starterExercise: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  advanceExercise: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  nationalExams: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  schoolExams: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  practiceExercises: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  CIAM_Basic: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  CIAM_Premium: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  Bonus_Prof: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  exo_perso: [{
    type: Schema.Types.ObjectId,
    ref: "HSCourseVideo",
  }, ],

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }, ],
});

/*===================================
          Course Video
===================================*/
const courseVideoSchema = new Schema({
  title: String,
  country: String,
  reference: String,
  examYear: String,
  author: String,
  otherInfo: String,
  school: String,
  videoLink: String,
  correctionVideoLink: String,
  pdf_Link: String,
  videoType: {
    type: String,
    enum: ["course", "bonus_profs", "starterEx", "advanceEx", "nationalExam", "schoolExam", "practiceEx", "CIAM_basic", "exo_perso",
      "CIAM_Premium"
    ]
  }
});

/*===================================
        Premium Content
===================================*/
const premiumContentSchema = new Schema({
  title: String,
  chapter: String,
  content: String,
  correctionVideoLink: String,
  pdf_Link: String,
  videoType: {
    type: String,
    enum: ["Exo_Perso", "Devoir_Test", "Conseils_Perso"]
  }
}, {
  timestamps: true
});

Class = mongoose.model("Class", classSchema);

Chapter = mongoose.model("Chapter", chapterSchema);

Subject = mongoose.model("Subject", subjectSchema);

HSCourseVideo = mongoose.model("HSCourseVideo", courseVideoSchema);

HStudent = mongoose.model("HStudent", HStudentSchema);

HTeacher = mongoose.model("HTeacher", homeTeacherSchema);

PremiumContent = mongoose.model("PremiumContent", premiumContentSchema);

HighSchool = mongoose.model("HighSchool", HighSchoolSchema);

// Grade = mongoose.model("Grade", gradeSchema);

module.exports = {
  Class,
  Chapter,
  Subject,
  HStudent,
  HTeacher,
  HSCourseVideo,
  PremiumContent,
  HighSchool
};