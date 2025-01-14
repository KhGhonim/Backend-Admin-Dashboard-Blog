import UserModel from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return res
      .status(403)
      .json({ message: "You can update only your account!" });
  }
  if (req.body === null) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return res
        .status(403)
        .json({ message: "Password must be atleast 6 characters" });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.body.name) {
    if (req.body.name.length < 3 || req.body.name.length > 20) {
      return res
        .status(400)
        .json({ message: "Name must be between 3 and 20 characters" });
    }
    if (req.body.name.includes(" ")) {
      return res.status(400).json({ message: "Name cannot contain spaces" });
    }
    if (req.body.name !== req.body.name.toLowerCase()) {
      return res.status(400).json({ message: "Name must be in lowercase" });
    }
    if (!req.body.name.match(/^[a-zA-Z0-9]+$/)) {
      return res
        .status(400)
        .json({ message: "Name must only contain letters and numbers" });
    }
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );

    return res.status(200).send(updatedUser);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(res.status(403).json("You can delete only your account!"));
  }
  try {
    await UserModel.findByIdAndDelete(req.params.userId)
      .then((user) => {
        if (user) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Error deleting user" });
      });
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json("You are not allowed to see all users");
  }
  try {
    const Allusers = await UserModel.find();
    if (!Allusers) {
      return res.status(403).send({ message: "No users found" });
    }
    res.status(200).send(Allusers);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export const deleteUserbyAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    res.status(403).json("You are not allowed to delete users");
  }
  try {
    await UserModel.findByIdAndDelete(req.params.userId)
      .then((user) => {
        if (user) {
          res.status(200).json({ message: "User deleted successfully" });
        } else {
          res.status(404).json({ message: "User not found" });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "Error deleting user" });
      });
  } catch (error) {
    console.log(error.message);
  }
};

export const ChangeAdminStatus = async (req, res, next) => {
  if (!req.user.isAdmin) {
    res.status(403).json("You are not allowed to change admin status");
  }

  try {
    await UserModel.findByIdAndUpdate(req.params.userId, {
      $set: {
        isAdmin: req.body.isAdmin,
      },
    });

    res.status(200).json({ message: "Admin status changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing admin status" });
  }
};

export const RefreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token not found" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    const newToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 3600000, // 1 hour
    });
    res.status(200).send({ message: "Token refreshed" });
  });
};
