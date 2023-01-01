const mongoose = require("mongoose");
const {
    format
} = require("date-fns");
const Schema = mongoose.Schema;

//All news
const allNewsSchema = new Schema({
    All_articles: [{
        type: Schema.Types.ObjectId,
        ref: "News",
    }],
});


// english club comment schema
const newsSchema = new Schema({
    newsCategory: {
        type: String,
        enum: ["English Club", "Maths", "Coding", "English Course"]
    },

    title: {
        type: String,
        trim: true,
    },

    newsSummary: {
        type: String,
        trim: true,
    },

    newsContent: {
        type: String,
        trim: true,
    },

    newsImageUrl: {
        type: String,
        trim: true,
    },

    readTime: {
        type: String,
        trim: true,
    },

    postedAT: {
        type: Date,
        default: format(Date.now(), "MM/dd/yyyy"),
    },

}, {
    timestamps: true,
});

const news = mongoose.model("News", newsSchema);
const allNews = mongoose.model("All_Articles", allNewsSchema);

module.exports = {
    news,
    allNews
};