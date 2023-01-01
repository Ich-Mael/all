const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// english club comment schema
const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    text: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const comment = mongoose.model("Comment", commentSchema);

module.exports = comment;