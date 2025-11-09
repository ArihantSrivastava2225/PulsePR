import express from 'express';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { connectDB } from './config/db.js';
import User from "./models/user.model.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:8080",   // your frontend origin
  credentials: true,                 // 👈 allows cookies
}))

app.post('/api/auth/signup', async(req, res) => {
    try{
        const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({ success: false, message: "User already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    const token = jwt.sign({ id : newUser._id }, JWT_SECRET, {
        expiresIn: "7h",
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 60 * 60 * 1000,
    });

    res.status(201).json({
        success: true,
        message: "Signup successful",
        user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
    }catch(error){
        console.error("Signup error: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

app.post("/api/auth/login", async(req, res) => {
    try{
        const existingToken = req.cookies.token;
        if(existingToken){
            try{
                const decoded = jwt.verify(existingToken, JWT_SECRET);
                return res.status(200).json({
                    success: true,
                    message: "User already logged in",
                    user: { id: decoded._id },
                })
            }catch(error){
                //token invalid or expired , so continue to signin
            }
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7h' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV==="production",
            sameSite: "strict",
            maxAge: 7 * 60 * 60 * 1000,
        })

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    }catch(error){
        console.error("Login error : ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})