const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsLetterMailsSchema = new Schema({
emails:[]	   
});


const newsLetter = mongoose.model("NewsLetter", newsLetterMailsSchema);

module.exports = newsLetter;
