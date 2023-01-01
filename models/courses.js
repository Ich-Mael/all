const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment'); // require

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: false
  },

  willLearn: {
    type: String,
    default: "New Skills"
  },

  category: {
    type: String,
    default: "Education"
  },

  syllabusSummary: {
    type: String,
    default: "Cours de 3 modules et 2 evalutions"
  },

  session: {
    startDate: {
      type: Date,
      default: Date.now()
    },

    endDate: {
      type: Date,
      default: moment().add(1, 'M')
    }
  },

  preview: [{
    title: {
      type: String,
    },
    link: {
      type: String,
    }
  }],

  description: {
    type: String,
    default: "New Course"
  },

  courseImageUrl: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    required: true,
  },

  requirements: {
    type: String,
    default: "No requirement for this course"
  },

  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }, ],

  modules: [{
    type: Schema.Types.ObjectId,
    ref: "Module",
  }, ],

  instructors: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }, ],

  students: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }, ],
}, {
  timestamps: true,
});

/*===================================
            Module
===================================*/

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  willLearnModule: {
    type: String,
    required: true,
  },

  explanationText: {
    type: String,
  },

  moreDetails: {
    type: String,
  },

  Assignment: [{
    type: Schema.Types.ObjectId,
    ref: "Practice",
  }],


  evaluation: {
    type: Schema.Types.ObjectId,
    ref: "Evaluation",
  },

  revealDate: {
    type: String,
    default: Date.now()
  },

  videoLinks: [{
    type: Schema.Types.ObjectId,
    ref: "EngCourseVideo",
  }, ],
});

/*===================================
           Practice
===================================*/

const practiceSchema = new Schema({
  title: {
    type: String,
  },

  category: {
    type: String,
    default: "S'entraîner"
  },

  links: [{
    type: String,
  }]
});

/*===================================
            Evaluation
===================================*/

const evaluationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  questions: [{
    Question_text: String,
    Question_response: String,
    options: [{
      id: String, //or number
      text: String,
      value: String,
    }, ],
  }, ],
  grade: {
    type: Schema.Types.ObjectId,
    ref: "Grade",
  },
});

/*===================================
          Grade 
===================================*/
const gradeSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  score: {
    type: Number,
    default: 0,
  },

  appreciation: {
    text: String,
    feedback: String,
  },
});



const engCourseVideoSchema = new Schema({
  title: {
    type: String,
  },

  lessonType: {
    type: String,
    default: "English lesson"
  },

  engCourseLink: {
    type: String,
  }
});


Course = mongoose.model("Course", courseSchema);

EngCourseVideo = mongoose.model("EngCourseVideo", engCourseVideoSchema);

Module = mongoose.model("Module", moduleSchema);

Practice = mongoose.model("Practice", practiceSchema);

Evaluation = mongoose.model("Evaluation", evaluationSchema);

Grade = mongoose.model("Grade", gradeSchema);

module.exports = {
  Course,
  Module,
  Practice,
  Evaluation,
  EngCourseVideo,
  Grade
};