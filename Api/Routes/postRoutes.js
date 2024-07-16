import express from "express";
import {
  AllPosts,
  createPost,
  deletePost,
  getPost,
  updateUserPost,
} from "../controllers/postController.js";
import JWTverifier from "../Helpers/JWTverifier.js";

const router = express.Router();

router.post("/create", JWTverifier, createPost);
router.get("/allposts", JWTverifier, AllPosts);
router.delete("/deletepost/:id", JWTverifier, deletePost);
router.get("/getPost/:id", JWTverifier, getPost);
router.put("/updatepost/:id", JWTverifier, updateUserPost);

export default router;
