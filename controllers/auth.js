const { get } = require("mongoose");
const User = require("../models/User");
const nodemailer = require("nodemailer");

exports.register = async (req, res, next) => {
  try {
    const { name, email, tel, password, role } = req.body;
    const user = await User.create({
      name,
      tel,
      email,
      password,
      role,
    });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" }); // Add return here to stop execution
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" }); // Add return here to stop execution
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" }); // Add return here to stop execution
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
};


const sendResetEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Please click the following link to reset your password: \n\n ${resetUrl}`,
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent");
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" }); // Add return here to stop execution
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "No account found with that email" });
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `Your Password Reset Token is: ${resetToken}`;

    await sendResetEmail(email, resetUrl);

    res.status(200).json({
      success: true,
      msg: "Password reset link sent to your email",
      resetToken,
    });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return res
      .status(500)
      .json({ success: false, msg: "Email could not be sent" });
  }
};


// cannot sent to email because gmail not allow nodemailer to login to account
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid or expired token",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      msg: "Password reset successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      msg: "Server error while resetting the password",
    });
  }
};
