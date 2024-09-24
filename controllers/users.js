import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import dotenv from 'dotenv'
import { generateToken } from "../utils/common.js";
import { error } from "console";

dotenv.config();
// configuring Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const token = generateToken();
        const url = `https://healthfitness-backend.onrender.com/users/activate/${token}`
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        await newUser.updateOne({$set: {token}});
        await transporter.sendMail({
            to: email,
            subject: "Account Activation",
            html:`<p><a href=${url}>Activate Account</a></p>`
        })
        res.status(201).json({ message: 'User registered successfully and account activation mail sent to your registered email' });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
};

export const activateUser = async (req, res) => {
    const { token } = req.params;
      // Set the Content-Type header to text/html
     res.setHeader('Content-Type', 'text/html');
    try {
      const user = await User.findOne({ token });
      if (!user) return res.status(400).json({ message: 'Invalid token' });
      await user.updateOne({ $set: { isActive: true }, $unset: { token: 1 } });
      //res.status(200).json({ message: 'Account activated. You can now login.' });
      res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Account Activated</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .container { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
                h1 { color: #4CAF50; }
                p { color: #555; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Account Activated!</h1>
                <p>You can now login to your account.</p>
              </div>
            </body>
          </html>
        `);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(403).json({message: "user not register"});
        }
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!user.isActive) return res.status(403).json({ message: 'Account not activated' });
        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `https://healthfitnessft.netlify.app/reset-password/${resetToken}`;

        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset.</p>
             <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const resetPassword = async (req, res) => {
    const resetToken = req.params.token;
    const { newPassword } = req.body;
    try {
        const user = await User.findOne({
            resetToken,
            resetTokenExpiration: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or expired' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// get user data
export const getUserData = async (req, res) => {
    const userId = req.params.userId;

    if(!userId){
        res.status(403).json({message: "userId ismissing"});
    }

    try{
        const user = await User.findById(userId).select('-password');
        res.json(user);
    }catch(err){
        res.status(500).json({error: err.message});
    }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    const userId = req.params.userId;

    const {name, email, profile} = req.body;
    
    if(!userId){
        res.status(403).json({message: "userId ismissing"});
    }

    try{
        const updateProfile = await User.findByIdAndUpdate(userId, {name, email, profile}, {new: true})
        res.json(updateProfile);
    }catch(err){
        res.status(500).json({error: err.message})
    }
};
