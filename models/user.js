const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const moment = require('moment'); // require

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  surname: {
    type: String,
    trim: true,
    required: true,
  },

  isVip: {
    type: Boolean,
    default: false
  },

  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },

  defP: {
    type: String,
    trim: true,
    required: true,
  },

  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },

  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Saisissez une adresse mail valide",
    },
    required: [true, "Email required"],
  },

  role: {
    type: String,
    default: "user",
    enum: [
      "user",
      "account-manager",
      "admin",
      "super-admin",
      "english-club-bm",
      "english-club-admin",
      "instructor",
      "english-coach",
      "student_manager",
      "englishClub-boardMember",
    ],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  phoneNumber: {
    type: String,
    trim: true,
  },

  imageUrl: {
    type: String,
    trim: true,
    default: "https://www.kindpng.com/picc/m/105-1055656_account-user-profile-avatar-avatar-user-profile-icon.png",
  },

  about: {
    type: String,
    trim: true,
  },

  englishLevel: {
    type: String,
    trim: true,
  },



  //High_school student
  isHighSchoolStudent: {
    type: Boolean,
    default: false,
  },

  highSchool_id: {
    type: String,
    trim: true,
    default: "",
  },

  // Is English club memebers
  isClubMember: {
    type: Boolean,
    default: false,
  },

  clubMember_id: {
    type: String,
    trim: true,
    default: "",
  },

  // Pecp student
  isPecpStudent: {
    type: Boolean,
    default: false,
  },

  pecpStudent_id: {
    type: String,
    trim: true,
    default: "",
  },

  // pecp coach
  isPecpCoach: {
    type: Boolean,
    default: false,
  },

  pecpCoach_id: {
    type: String,
    trim: true,
    default: "",
  },

  //Home Teacher
  isHomeTeacher: {
    type: Boolean,
    default: false,
  },

  homeTeacher_id: {
    type: String,
    trim: true,
    default: "",
  },

  //social media links
  likedPage: {
    type: Boolean,
    default: false,
  },

  facebookLink: {
    type: String,
    trim: true,
    default: "https://web.facebook.com/Afro-House-Of-Knowledge-104795908266730",
  },

  twitterLink: {
    type: String,
    trim: true,
    default: "https://twitter.com/afro_of",
  },

  linkedIn: {
    type: String,
    trim: true,
    default: "https://www.linkedin.com/in/ismael-zerbo-443b73220/",
  },

  whatsAppLink: {
    type: String,
    trim: true,
    default: "https://wa.me/22653344444"
  },

  // English club details
  isEnglishClubBoardMember: {
    type: Boolean,
    default: false,
  },


  // programs
  ownedPrograms: [],

  // My live perfomance
  myLivePerf : [{
    type: Schema.Types.ObjectId,
    ref: "LivePerf",
  },],

  // courses
  specialProgram: [{
    courseTitle: String,

    startDate: {
      type: Date,
      default: Date.now()
    },

    endDate: {
      type: Date,
      default: moment().add(1, 'M')
    }

  },],

  coursesGiven: [{
    type: Schema.Types.ObjectId,
    ref: "Course",
  },],

  coursesTaken: [{
    type: Schema.Types.ObjectId,
    ref: "Course",
  },],

  //grades
  grades: [
    [{
      type: Schema.Types.ObjectId,
      ref: "course",
    },],
  ],
}, {
  timestamps: true
});



userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("User", userSchema);


module.exports = user;