import CommentModel from "../Models/Comments.js";
import PostModel from "../Models/Post.js";
import UserModel from "../Models/User.js";

export const totalusers = async (req, res, next) => {
  const totalusers = await UserModel.find();
  if (!totalusers) {
    return res.status(404).send({ message: "No users found" });
  }
  res.status(200).send(totalusers);
};

export const recentUsers = async (req, res, next) => {
  const recentUsers = await UserModel.find().sort({ createdAt: -1 }).limit(5);

  if (!recentUsers) {
    return res.status(404).send({ message: "No users found" });
  }

  res.status(200).send(recentUsers);
};

export const totalcomments = async (req, res, next) => {
  const totalcomments = await CommentModel.find();
  if (!totalcomments) {
    return res.status(404).send({ message: "No Comments found" });
  }
  res.status(200).send(totalcomments);
};

export const recentcomments = async (req, res, next) => {
  const recentcomments = await CommentModel.find().sort({ createdAt: -1 }).limit(5);

  if (!recentcomments) {
    return res.status(404).send({ message: "No users found" });
  }

  res.status(200).send(recentcomments);
};

export const totalPosts = async (req, res, next) => {
  const totalPosts = await PostModel.find();
  if (!totalPosts) {
    return res.status(404).send({ message: "No Posts found" });
  }
  res.status(200).send(totalPosts);
};
