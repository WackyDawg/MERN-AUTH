import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationCode.utils.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendResetSuccessEmail } from "../mailtrap/emails.js";
import crypto from "crypto"

export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExist = await User.findOne({ email });

        if (userAlreadyExist) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const verificationToken = generateVerificationToken();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 1 * 60 * 60 * 1000,
        });

        await user.save();
        generateTokenAndSetCookie(res, user._id);
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({ message: "User created successfully", user: { ...user._doc, password: undefined } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.name)
        res.status(200).json({ success: true, message: "Email verified successfully", user: { ...user._doc, password: undefined } });

    } catch (error) {
        console.error('error in verifyEmail', error.message)
        res.status(500).json({ success: false, message: "Error verifying email" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user  = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date (new Date().getTime ());
        await user.save();

        res.json({ success: true, message: "Logged in successfully", user: { _id: user._id, name: user.name, email: user.email, isVerified: user.isVerified, lastLogin: user.lastLogin } });
    } catch (error) {
        console.error('error in login', error.message)
        res.status(400).json({ success: false, message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user  = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(user.email,  `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    res.status(200).json({ success: true, message: "Reset password link sent to your email" });
    } catch (error) {
        console.error('error in forgotPassword', error);
        res.status(500).json({ success: false, message: "Password reset link sent to your email" });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const {token} = req.params
        const {password} = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now() } });
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found or expired reset password token" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        sendResetSuccessEmail(user.email);
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error('error in resetPassword', error, error.stack);
        res.status(500).json({ status: "Internal Server Error " + error.message }); 
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        res.status(200).json({ success: true, message: "User authenticated", user: { _id: user._id, name: user.name, email: user.email, isVerified: user.isVerified, lastLogin: user.lastLogin } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" }); 
    }
};
