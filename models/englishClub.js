const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment'); // require
const {
  format
} = require("date-fns");

// english club schema
const englishClubSchema = new Schema({
  city: {
    type: String,
    trim: true,
  },

  clubType: {
    type: String,
    required: true,
    enum: [
      "High-school",
      "University",
      "Company",
      "Professional",
      "Private",
      "Simple",
    ],
  },

  EnglishType: {
    type: String,
    trim: true,
  },

  instituition: {
    type: String,
    trim: true,
    required: true,
  },

  acronym: {
    type: String,
    trim: true,
    required: true,
  },

  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },

  motto: {
    type: String,
    trim: true,
    required: true,
  },

  description: {
    type: String,
    trim: true,
    default: `<h1 style="text-align: center;"><span style="font-size: 14pt; color: #236fa1; font-family: 'trebuchet ms', geneva, sans-serif;"><strong>ENGLISH CLUB INFORMATION</strong></span></h1>
    <p><span style="font-size: 14pt; font-family: 'book antiqua', palatino, serif;">In This Section of the English Club,</span></p>
    <p><span style="font-size: 14pt; font-family: 'book antiqua', palatino, serif;">A visitor should find all the information about your english club and the requirements to become a member.&nbsp;</span></p>
    <p><em><span style="font-size: 14pt; font-family: 'book antiqua', palatino, serif;">The information you can put in this section can be :</span></em></p>
    <p><span style="font-size: 14pt; font-family: 'book antiqua', palatino, serif;">&nbsp; &nbsp; &nbsp;Club origin or creation history</span></p>
    <p><span style="font-size: 14pt; font-family: 'book antiqua', palatino, serif;">&nbsp; &nbsp; &nbsp;Club Goals</span></p>
    <p><span style="font-size: 14pt; font-family: 'book antiqua', palatino, serif;">&nbsp; &nbsp; &nbsp;Membership requirements</span></p>
    <p><span style="font-size: 14pt; font-family: 'book antiqua', palatino, serif;">&nbsp; &nbsp; &nbsp;Contact Information</span></p>
    <p>&nbsp;</p>`
  },

  foundDate: {
    type: String,
    required: true,
  },

  // image
  bannerImageUrlMedium: {
    type: String,
    default: "https://i.ibb.co/PxNvNrv/neci-family.jpg",
    trim: true,
  },

  clubPresentationVideoUrl: {
    type: String,
    trim: true,
    default: "https://www.youtube.com/embed/MGbCBxVdm5Y"
  },

  //club gallery
  clubGallery: [{
    imageTitle: String,
    imageLink: String,
  }],

  logoImageUrl: {
    type: String,
    required: true,
  },

  instituitionLogoUrl: {
    type: String,
    required: true,
  },

  // social media links
  facebookLink: {
    type: String,
    trim: true,
  },

  twitterLink: {
    type: String,
    trim: true,
  },

  instagramLink: {
    type: String,
    trim: true,
  },

  youtubeLink: {
    type: String,
    trim: true,
  },

  clubMentor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  mentorDetails: {
    default: "Mentor Details",
    type: String,
    trim: true,
  },

  onlineMonthlyEvaluationLink: {
    type: String,
  },

  englishCoach: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }, ],

  clubEvents: [{
    type: Schema.Types.ObjectId,
    ref: "Event",
  }, ],

  boardMembers: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishClubMember",
  }, ],

  members: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishClubMember",
  }, ],

  workersOfMonth: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishClubWorkersOfMonth",
  }, ],

  articles: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishClubArticle",
  }, ],

  dailyVocab: [{
    type: Schema.Types.ObjectId,
    ref: "DailyVocabulary",
  }, ],

  weeklyMeeting: [{
    type: Schema.Types.ObjectId,
    ref: "ClubMeeting",
  }, ],

  onlineDebates: [{
    type: Schema.Types.ObjectId,
    ref: "OnlineDebate",
  }, ],

  weeklyVideoLesson: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyLessons",
  }, ],

  media: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishClubMedia",
  }, ],

  // English Club Exercise
  grammarExercise: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],

  vocabularyExercise: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],

  LSC: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],


  readingComprehensionExercise: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],

  listeningExercise: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],

  watchingComprehensionExercise: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],

  readAloudExercise: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],

  dictationExercise: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishWeeklyExercises",
  }, ],

}, {
  timestamps: true,
});

// english club hub schema
const englishClubHubSchema = new Schema({
  cityName: {
    type: String,
    trim: true
  },

  country: {
    type: String,
    enum: [
      "Burkina-Faso",
      "Niger",
      "Togo",
      "Côte d'Ivoire",
      "Benin",
      "Cameroun",
      "Senegal",
    ],
  },

  clubs: {
    High_school: [{
      type: Schema.Types.ObjectId,
      ref: "EnglishClub",
    }],

    University: [{
      type: Schema.Types.ObjectId,
      ref: "EnglishClub",
    }],

    Company: [{
      type: Schema.Types.ObjectId,
      ref: "EnglishClub",
    }],

    Professional: [{
      type: Schema.Types.ObjectId,
      ref: "EnglishClub",
    }],

    Private: [{
      type: Schema.Types.ObjectId,
      ref: "EnglishClub",
    }],

    Simple: [{
      type: Schema.Types.ObjectId,
      ref: "EnglishClub",
    }]
  },

  focalPoint: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
});

// english club event schema
const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  aboutEvent: {
    type: String,
    default: "About"
  },

  eventImgLink: {
    type: String,
    default: ""
  },

  date: {
    type: Date,
    default: Date.now()
  },

  venue: {
    type: String,
    default: "At Head-quarter"
  },

  time: {
    type: String,
    default: "3:00 p.m"
  },

  entry: {
    type: String,
    enum: ["Free", "Ticket", "On invitation"]
  }
}, {
  timestamps: true,
});

// club members schema
const englishClubMemberSchema = new Schema({
  clubMember: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  memberEnglishClubs: [{
    type: Schema.Types.ObjectId,
    ref: "EnglishClub",
  }],

  clubMemberProgress: [{
    type: Schema.Types.ObjectId,
    ref: "ProgressTrack",
  }],


  isBoardMember: {
    type: Boolean,
    default: false
  },

  position: {
    type: String,
    default: "Member"
  },

  mediaComments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }, ],

  isMuted: {
    type: Boolean,
    default: false
  },

  level: {
    type: String,
    required: true,
    enum: [
      "A1 - Elementary",
      "A2 - Pre-Intermediate",
      "B1 - Intermediate",
      "B2 - Upper-Intermediate",
      "C1 - Advanced",
      "C2 - Proficient",
    ],
  },
})

// club member progress schema
const progressTrackSchema = new Schema({
  testLevel: {
    type: String,
    required: true,
    enum: [
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2"
    ],
  },

  testGrade: {
    type: Number,
    required: true,
  },

  period: {
    type: Date,
    default: Date.now(),
    required: true,
  },

  feedback: {
    type: String,
  },

  structure: {
    type: String,
    required: true,
    enum: [
      "Not Sufficient",
      "Acceptable",
      "Sufficient",
      "Good",
      "Very Good",
      "Excellent",
    ],
  },

  pronunciation: {
    type: String,
    required: true,
    enum: [
      "Not Sufficient",
      "Acceptable",
      "Sufficient",
      "Good",
      "Very Good",
      "Excellent",
    ],
  },


  fluency: {
    type: String,
    required: true,
    enum: [
      "Not Sufficient",
      "Acceptable",
      "Sufficient",
      "Good",
      "Very Good",
      "Excellent",
    ],
  },

  vocabulary: {
    type: String,
    required: true,
    enum: [
      "Not Sufficient",
      "Acceptable",
      "Sufficient",
      "Good",
      "Very Good",
      "Excellent",
    ],
  },

  comprehension: {
    type: String,
    required: true,
    enum: [
      "Not Sufficient",
      "Acceptable",
      "Sufficient",
      "Good",
      "Very Good",
      "Excellent",
    ],
  },

  interaction: {
    type: String,
    required: true,
    enum: [
      "Not Sufficient",
      "Acceptable",
      "Sufficient",
      "Good",
      "Very Good",
      "Excellent",
    ],
  }

})

// english club article schema
const englishClubArticleSchema = new Schema({
  title: {
    type: String,
  },
  // image
  articleImage: {
    type: String,
  },

  articleSummary: {
    type: String,
  },

  articleContent: {
    type: String,
  },

  articleAuthor: {
    type: String,
  },

  postedAT: {
    type: Date,
    default: format(Date.now(), "MM/dd/yyyy"),
  },

  articleComments: {
    type: String,
  },
}, {
  timestamps: true,
});

//Daily vocabulary schema
const dailyVocabularySchema = new Schema({
  wordOfDay: {
    word: {
      type: String,
      default: "Knowledge",
    },

    wordMeaning: {
      type: String,
      default: "",
    },

    learnMoreWord: {
      type: String,
    },
  },

  IdiomDay: {
    idiom: {
      type: String,
      default: "When pigs fly",
    },

    idiomMeaning: {
      type: String,
      default: "To say something will never happen",
    },

    learnMoreIdiom: {
      type: String,
      default: "",
    },
  },
});

//weekly meeting
const englishClubMeetingSchema = new Schema({
  meetingDate: {
    type: Date,
    default: Date.now(),
  },
  venue: {
    type: String,
    default: "Afro House of Knowledge",
  },
  meetingTime: {
    type: String,
  },
  about: {
    type: String,
    default: "Afro House of Knowledge",
  },
});

// weekly online debate
const weeklyOnlineDebateSchema = new Schema({
  topicOne: {
    type: String,
    default: "No debate yet",
  },

  debateDateOne: {
    type: Date,
    default: Date.now(),
  },

  debateTimeOne: {
    type: String,
  },

  topicTwo: {
    type: String,
    default: "No debate yet",
  },

  debateDateTwo: {
    type: Date,
    default: Date.now(),
  },

  debateTimeTwo: {
    type: String,
  },
  aboutTopic: {
    type: String,
  },
});

// weekly lesson schema
const weeklyLessonSchema = new Schema({
  lessonTitle: {
    type: String,
  },
  // image
  videoLink: {
    type: String,
    trim: true,
  },

  lessonSummary: {
    type: String,
  },

  lessonAuthor: {
    type: String,
  },

  postedAT: {
    type: Date,
    default: format(Date.now(), "MM/dd/yyyy"),
  },
}, {
  timestamps: true,
});

// weekly Exercise schema
const weeklyExerciseSchema = new Schema({
  exerciseTitle: {
    type: String,
  },

  exerciseLink: {
    type: String,
  },

  readingText:{
    type: String,
  },

  slowReadingLink:{

  },

  normalReadingLink:{

  },

  exerciseCorrectionLink: {
    type: String,
  },

  level: {
    type: String,
    required: true,
    enum: [
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2",
    ],
  },

  exerciseType: {
    type: String,
    required: true,
    enum: [
      "Grammar",
      "Vocabulary",
      "Listening Comprehension",
      "Dictation",
      "Reading Comprehension",
      "Watching Comprehension",
      "Read Aloud",
      "LSC"
    ],
  },

  moreExerciseLink: {
    type: String,
  },


  postedAT: {
    type: Date,
    default: format(Date.now(), "MM/dd/yyyy"),
  },
}, {
  timestamps: true,
});



// english club leaders schema
const workersOfMonthSchema = new Schema({
  studentOfMonth: {
    fullname: {
      type: String,
    },
    imageUrl: {
      type: String,
    },

    reasons: {
      type: String,
    },

    about: {
      type: String,
    },
  },

  instructorOfMonth: {
    fullname: {
      type: String,
    },

    imageUrl: {
      type: String,
    },

    reasons: {
      type: String,
    },

    about: {
      type: String,
    },
  },
}, {
  timestamps: true,
});

// media schema
const englishClubMediaSchema = new Schema({
  mediaTitle: {
    type: String,
    trim: true,
  },

  videoLink: {
    type: String,
    trim: true,
  },

  mediaComments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }, ],
}, {
  timestamps: true,
});


const englishClubHub = mongoose.model("EnglishClubHub", englishClubHubSchema);

const englishClubs = mongoose.model("EnglishClub", englishClubSchema);

const englishClubMember = mongoose.model("EnglishClubMember", englishClubMemberSchema);

const progressTrack = mongoose.model("ProgressTrack", progressTrackSchema);

const event = mongoose.model("Event", eventSchema);




const englishClubMedia = mongoose.model(
  "EnglishClubMedia",
  englishClubMediaSchema
);


const englishClubArticles = mongoose.model(
  "EnglishClubArticle",
  englishClubArticleSchema
);

const dailyVocabulary = mongoose.model(
  "DailyVocabulary",
  dailyVocabularySchema
);

const clubMeeting = mongoose.model("ClubMeeting", englishClubMeetingSchema);

const onlineDebate = mongoose.model("OnlineDebate", weeklyOnlineDebateSchema);

const englishWeeklyLessons = mongoose.model(
  "EnglishWeeklyLessons",
  weeklyLessonSchema
);

const englishWeeklyExercises = mongoose.model(
  "EnglishWeeklyExercises",
  weeklyExerciseSchema
);


const englishClubWorkersOfMonth = mongoose.model(
  "EnglishClubWorkersOfMonth",
  workersOfMonthSchema
);

module.exports = {
  englishClubMember,
  englishClubHub,
  englishClubs,
  progressTrack,
  event,
  englishClubArticles,
  dailyVocabulary,
  onlineDebate,
  clubMeeting,
  englishWeeklyLessons,
  englishWeeklyExercises,
  englishClubWorkersOfMonth,
  englishClubMedia,
};