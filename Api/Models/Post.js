import mongoose from "mongoose";
const { Schema, models } = mongoose;

// User Schema
const postSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    catagory: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },

    postImage: {
      type: String,
      default:
        "https://myteddyworld.com/image/cache/catalog/basel-demo/blog-1140x700.png",
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = models.Post || mongoose.model("Post", postSchema);

export default PostModel;
