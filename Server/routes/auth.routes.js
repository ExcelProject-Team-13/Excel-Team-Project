import express from "express";
import jwt from "jsonwebtoken";
import axios from 'axios';

import User from "../model/user.model.js";

const router = express.Router();

router.post("/signup", async (req, res)=>{
    const { firstName, lastName, username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ firstName, lastName, email, username, role, password });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

router.post("/login" , async (req, res)=>{
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
})


router.post("/google", async (req, res) => {
    const { access_token } = req.body;

    try {
        // Get user info from Google
        const googleUserInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { email, given_name, family_name } = googleUserInfo.data;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                email,
                firstName: given_name,
                lastName: family_name,
                username: email.split('@')[0],
                password: Math.random().toString(36).slice(-8), // Random password
                role: "user"
            });
            await user.save();
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ 
            message: "Google login successful",
            token,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Google authentication failed", 
            error: error.message 
        });
    }
});

router.post("/google/signup", async (req, res) => {
    const { userInfo } = req.body;

    try {
        const { email, given_name, family_name } = userInfo;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: "Account already exists with this email. Please login instead." 
            });
        }

        // Create new user
        const newUser = new User({
            email,
            firstName: given_name,
            lastName: family_name,
            username: email.split('@')[0],
            password: Math.random().toString(36).slice(-8), // Random password
            role: "user"
        });

        await newUser.save();

        res.status(201).json({ 
            message: "Account created successfully with Google",
            role: newUser.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Failed to create account with Google", 
            error: error.message 
        });
    }
});

export default router;