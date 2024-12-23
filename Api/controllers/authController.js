import bcrypt from "bcrypt";
import MongoDB from "../../Config/MongoDB.js";
import UserModel from "../Models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const objfromFrontend = req.body;
    await MongoDB();
    const EmailExists = await UserModel.findOne({
      email: objfromFrontend.email,
    });

    if (EmailExists) {
      return res.status(400).send({ message: "User already exists" });
    }

    const NameExists = await UserModel.findOne({ name: objfromFrontend.name });

    if (NameExists) {
      return res.status(400).send({
        message: "Name already exists, Please choose a different name",
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(objfromFrontend.password, salt);

    const user = await UserModel.create({
      name: objfromFrontend.name,
      email: objfromFrontend.email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    if (user) {
      res.status(201).send({ message: "User created successfully" });
    } else {
      res.status(400).send({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const objfromFrontend = req.body;
    await MongoDB();
    const user = await UserModel.findOne({ email: objfromFrontend.email });

    if (!user) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(
      objfromFrontend.password,
      user.password
    );
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid password" });
    }

    // Generate JWT
    if (user && isMatch) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET, { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" } // Long-lived token
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        maxAge: 3600000, // 1 hour
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        maxAge: 7 * 24 * 3600000, // 7 days
      });
      res.status(200).send({ user });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const Google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
        
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" } // Long-lived token
      );
      
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        maxAge: 3600000, // 1 hour
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        maxAge: 7 * 24 * 3600000, // 7 days
      });
      res.status(200).send({ user });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const newUser = await UserModel.create({
        name: `${name.toLowerCase().replace(/ /g, "")}${Math.random()
          .toString(9)
          .slice(-4)}`,

        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
      });
      res.status(200).send({ user: newUser });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const signout = (req, res, next) => {
  try {
    res.clearCookie("jwt");
    res.clearCookie("refreshToken");
    res.status(200).send("User has been signed out");
  } catch (error) {
    res.status(500).send(error.message);
  }
};
