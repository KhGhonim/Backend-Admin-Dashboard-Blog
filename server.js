import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import MongoDB from "./Config/MongoDB.js";
import authRoutes from "./Api/Routes/authRoutes.js";
import userRoutes from "./Api/Routes/userRoutes.js";
import postRoutes from "./Api/Routes/postRoutes.js";
import dashboardRoutes from "./Api/Routes/dashboardRoutes.js";
import searchRoutes from "./Api/Routes/searchRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;
app.use(cookieParser());

// Middleware Connections
app.use(
  cors({
    origin: process.env.FRONTEND_DB_URL, // Frontend domain
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(express.json());

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/post", postRoutes);
app.use("/api", searchRoutes);

// Connection
const startServer = async () => {
  await MongoDB();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
