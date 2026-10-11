import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRouter from "./routes/dashboard/projectRoutes.js";
import taskRouter from "./routes/dashboard/taskRoutes.js";
import searchRouter from "./routes/dashboard/searchRoutes.js";
import userRouter from "./routes/dashboard/userRoutes.js";
import teamRouter from "./routes/dashboard/teamRoutes.js";
import authRouter from "./routes/auth/authRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";

// Express → npm i express - - save ~
// Nodemon → npm i nodemon - - save-dev~
// Mongoose → npm i mongoose~
// Dotenv → npm i dotenv~
//  Cors →  npm i cors~
//  bcryptjs → npm i bcryptjs~
// Resend → npm i resend~
// crypto → npm i crypto-js~
// JWT → npm i jsonwebtoken~
//  Cookie-parser → npm i cookie-parser~

const app = express();

// const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Enable CORS for the frontend URL with credentials support

app.use(cookieParser());
// Routes
app.use("/projects", projectRouter);
app.use("/tasks", taskRouter);
app.use("/search", searchRouter);
app.use("/users", userRouter);
app.use("/teams", teamRouter);
app.use("/auth", authRouter);

// Global Error Handler
app.use(errorHandler);

export default app;

//!!
// تقدر تفتحه بـ:

// Windows / Linux: Ctrl + Shift + ]
// أو اضغط على السهم الصغير (>) اللي جنب رقم السطر.

// ولطي الكود:

// Ctrl + Shift + [
// 2. فتح كل الكود المطوي مرة واحدة

// لو كل الملفات مطوية:

// Ctrl + K ثم Ctrl + J

// (اضغط Ctrl + K ثم ارفع إيدك واضغط Ctrl + J)

// وده اسمه Unfold All.

// ولو عايز تطوي الكل:

// Ctrl + K ثم Ctrl + 0
