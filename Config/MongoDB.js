import mongoose from "mongoose";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

const MongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL,);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
};
export default MongoDB;
