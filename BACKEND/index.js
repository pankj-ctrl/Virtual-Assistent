import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import grokResponse from "./grok.js";

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.listen(port, () => {
    connectDb();
    console.log("server is running");
});