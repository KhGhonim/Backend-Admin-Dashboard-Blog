import express from "express";
import {
  totalusers,
  recentUsers,
  recentcomments,
  totalcomments,
  totalPosts,
} from "../controllers/dahsboardController.js";

const router = express.Router();

router.get("/dashboard/totalusers", totalusers);
router.get("/dashboard/recentUsers", recentUsers);
router.get("/dashboard/recentcomments", recentcomments);
router.get("/dashboard/totalcomments", totalcomments);
router.get("/dashboard/totalPosts",  totalPosts);

export default router;
