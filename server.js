import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import MongoDB from "./Config/MongoDB.js";
import authRoutes from "./Api/Routes/authRoutes.js";
import userRoutes from "./Api/Routes/userRoutes.js";
import postRoutes from "./Api/Routes/postRoutes.js";
import dashboardRoutes from "./Api/Routes/dashboardRoutes.js";
const app = express();
const port = 3000;
app.use(cookieParser());

// Middleware Connections
app.use(
  cors({
    origin: "https://admin-dashboard-blog.vercel.app", // Frontend domain
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

// Connection
const startServer = async () => {
  await MongoDB();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

startServer();
