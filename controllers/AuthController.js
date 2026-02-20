const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/email.js");

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, mobile, password, role } = req.body;

//     // 1. Check user exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // 2. Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 3. Create user
//     user = await User.create({
//       name,
//       email,
//       mobile,
//       password: hashedPassword,
//       role: role || "user"
//     });

    

//     // 5. Response
//     res.status(201).json({
//       message: "User registered successfully",
      
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         mobile: user.mobile,
//         role: user.role,
//       }
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is: ${otp}. It will expire in 10 minutes.`
    );

    res.json({ message: "OTP sent to email" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
