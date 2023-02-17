const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment'); // require
const {
    format
} = require("date-fns");

// PECP Student  schema
const pecpStudentSchema = new Schema({
    pecpStudentBasicInfo: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    learningGoal: {
        type: String,
        required: true,
    },

    assignedCoach: [{
        type: Schema.Types.ObjectId,
        ref: "pecpCoach",
    }],

    myCv: [{
        type: Schema.Types.ObjectId,
        ref: "pecpStudentCv",
    }],

    generalRecommendation: {
        type: String,
        default: "Practice English as much as you can"
    },

    studentCourses: [{
        type: Schema.Types.ObjectId,
        ref: "Courses",
    }],

    pecpStudentProgress: [{
        type: Schema.Types.ObjectId,
        ref: "pecpStudentProgressTrack",
    }],

    pecpStudentConvFeedback: [{
        type: Schema.Types.ObjectId,
        ref: "pecpConvFeedback",
    }],

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

// PECP Coach  schema
const pecpCoachSchema = new Schema({
    pecpCoachBasicInfo: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    coachPresentationLink: {
        type: String,
    },

    students: [{
        type: Schema.Types.ObjectId,
        ref: "pecpStudent",
    }],

    feedbackFromStudent: [{
        studentName: String,
        feedback: String,
    }],

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
});

// PECP Student progress schema
const pecpStudentProgressTrackSchema = new Schema({
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
        required: true,
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

//  PECP Student Conversation feedback
const pecpConvFeedbackSchema = new Schema({
    feedback: {
        type: String,
        default: "Feedback will be provided once the conversation practice is done."
    },

    topicTitle: {
        type: String,
    },

    topicDetails: {
        type: String,
    },

    callDate: {
        type: Date,
        default: format(Date.now(), "MM/dd/yyyy"),
    },

    callTime: {
        type: String,
    },

    callLinkInfo: {
        type: String,
    },

    recommendation: {
        type: String,
        default: "Advice for improvement will be provided once the conversation practice is done."
    },

    suggested_exercise: {
        type: String,
        default: "Link for self-pratice will be provided once the conversation practice is done."
    }
}, {
    timestamps: true,
});

// PECP Student Cv schema
const pecpStudentCvSchema = new Schema({

    studentCvPdf: {
        type: String,
    },

    studentCvInterview: {
        type: String,
    },

    studentCvAudio: {
        type: String,
    },

});


const pecpStudent = mongoose.model("pecpStudent", pecpStudentSchema);

const pecpCoach = mongoose.model("pecpCoach", pecpCoachSchema);

const pecpConvFeedback = mongoose.model("pecpConvFeedback", pecpConvFeedbackSchema);

const pecpStudentProgressTrack = mongoose.model("pecpStudentProgressTrack", pecpStudentProgressTrackSchema);


const pecpStudentCv = mongoose.model("pecpStudentCv", pecpStudentCvSchema);

module.exports = {
    pecpStudent,
    pecpCoach,
    pecpStudentCv,
    pecpConvFeedback,
    pecpStudentProgressTrack,
};