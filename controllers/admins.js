const Admins = require("../models/Admins");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.adminLogin = catchAsyncErrors(async (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ErrorHandler('incomplete data', 400));
    }

    const admin = await Admins.findOne({ username }).select("+password");

    if (!admin) {
        return next(new ErrorHandler('admin does not exist', 400))
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorHandler('incorrect password', 400));
    }

    const token = await admin.generateToken();

    res.status(200).json({
        success: true,
        admin,
        token,
        message: "login successfully"
    })

    // const options = {
    //     expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    //     httpOnly: true
    // }

    // res.status(200).cookie("token", token, options).json({
    //     success: true,
    //     admin,
    //     token
    // })

});

exports.adminProfile = catchAsyncErrors(async (req, res) => {

    const admin = await Admins.findById(req.admin._id);

    res.status(200).json({
        success: true,
        admin
    })

});

exports.adminLogout = catchAsyncErrors(async (req, res) => {

    res.status(200).json({
        success: true,
        message: "logged out successfully"
    })
});

exports.resetAdminPassword = catchAsyncErrors(async (req, res, next) => {

    const admin = await Admins.findById(req.admin._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return next(new ErrorHandler('please provide old password and new password', 400));
    }

    const isMatch = await admin.matchPassword(oldPassword);


    if (!isMatch) {
        return next(new ErrorHandler('incorrect old password', 400));
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
        success: true,
        message: "password updated"
    })
});


// exports.forgetAdminPassword = async (req, res) => {
//     try {
//         const admin = await Admins.findOne({ username: req.body.username });

//         if (!admin) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Admin not exist"
//             })
//         }

//         const resetPasswordToken = admin.getResetPasswordToken();

//         await admin.save();

//         const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;

//         const message = `Reset your password by clicking on the link below : \n\n ${resetUrl}`;

//         try {
//             await sendEmail({
//                 email: admin.username,
//                 subject: "Reset Password",
//                 message
//             })

//             res.status(200).json({
//                 success: true,
//                 message: `Email sent to ${admin.username}`
//             })

//         } catch (error) {
//             admin.resetPasswordToken = undefined;
//             admin.resetPasswordExpire = undefined;
//             await admin.save();

//             res.status(500).json({
//                 success: false,
//                 message: error.message
//             })
//         }

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }


// exports.resetAdminForgetPassword = async (req, res) => {
//     try {
//         const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

//         const admin = await Admins.findOne({
//             resetPasswordToken,
//             resetPasswordExpire: { $gt: Date.now() }
//         })

//         if (!admin) {
//             res.status(401).json({
//                 success: false,
//                 message: "Token is invalid or has expired"
//             })
//         }

//         admin.password = req.body.password;

//         admin.resetPasswordToken = undefined;
//         admin.resetPasswordExpire = undefined;
//         await admin.save();

//         res.status(200).json({
//             success: true,
//             message: "password updated"
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }