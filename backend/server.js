import express from 'express';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { connectDB } from './config/db.js';
import User from "./models/user.model.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import campaignRoutes from './routes/campaign.routes.js';
import chatRoutes from './routes/chat.routes.js';
import eventRoutes from './routes/event.routes.js';
import teamRoutes from './routes/team.routes.js';
import insightsRoutes from './routes/insights.routes.js';
import mailRoutes from './routes/mail.routes.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:8080",   // your frontend origin
    credentials: true,                 // 👈 allows cookies
}));

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
    });

    socket.on('send_message', (data) => {
        // Broadcast to the specific room or globally
        if (data.room) {
            socket.to(data.room).emit('receive_message', data);
        } else {
            socket.broadcast.emit('receive_message', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.set('io', io);

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
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
            user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
        });
    } catch (error) {
        console.error("Signup error: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

app.post("/api/auth/login", async (req, res) => {
    try {
        // Removed existing token check to allow user switching
        console.log("Login attempt for:", req.body.email);

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7h' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 60 * 60 * 1000,
        })

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    } catch (error) {
        console.error("Login error : ", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
});

app.use('/api/campaigns', campaignRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/ai', aiRoutes);

httpServer.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})