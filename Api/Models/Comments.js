import mongoose from "mongoose";
const { Schema, models } = mongoose;

// User Schema
const commentsSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },

    postImage: {
      type: String,
      default:
        "https://www.testhouse.net/wp-content/uploads/2021/11/default-avatar.jpg",
    },
    postId: {
      type: String,
    },

    numberoflikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel =
  models.Comment || mongoose.model("Comment", commentsSchema);

export default CommentModel;
