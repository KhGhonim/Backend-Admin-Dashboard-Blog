import express from "express";
import JWTverifier from "../Helpers/JWTverifier.js";
import {
  ChangeAdminStatus,
  deleteUser,
  deleteUserbyAdmin,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.put("/update/:userId", JWTverifier, updateUser);
router.delete("/delete/:userId", JWTverifier, deleteUser);
router.delete("/Admin/deleteuser/:userId", JWTverifier, deleteUserbyAdmin);
router.get("/AllUsers", JWTverifier, getAllUsers);
router.put("/Admin/:userId", JWTverifier, ChangeAdminStatus);

export default router;
