const SuperAdmin = require('../models/SuperAdmin');
const Admins = require("../models/Admins");
const Candidate = require("../models/Candidates");
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.registerAdmins = catchAsyncErrors(async (req, res, next) => {

    const { username, password } = req.body;
    if (!username || !password) {
        return next(new ErrorHandler('Incomplete data', 400));
    }

    let admin = await Admins.findOne({ username });
    if (admin) {
        return next(new ErrorHandler('Admin already exist', 400));
    }

    admin = await Admins.create({
        username,
        password
    })

    res.status(201).json({
        success: true,
        admin,
        message:'Register Successfully'
    })
});

exports.getAllAdmins = catchAsyncErrors(async (req, res) => {

    const admins = await Admins.find({});
    res.status(200).json({
        success: true,
        admins,
        message:'All Admins Record'
    })
});

exports.getSingleAdmin = catchAsyncErrors(async (req, res, next) => {

    const admin = await Admins.findById(req.params.id);

    if (!admin) {
        return next(new ErrorHandler('Admin not found', 404));
    }

    res.status(200).json({
        success: true,
        admin,
        message: 'Single Admin Record'
    })
});

exports.superAdminLogin = catchAsyncErrors(async (req, res, next) => {

    const { username, password } = req.body;    

    if (!username || !password) {
        return next(new ErrorHandler('Incomplete data', 400));
    }

    const sadmin = await SuperAdmin.findOne({ username }).select("+password");

    if (!sadmin) {
        return next(new ErrorHandler('incorrect username or password', 400));
    }


    // @define: password encrypt demo code
    // await sadmin.encryptPasswordDemo();
    // await sadmin.save();

    const isMatch = await sadmin.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorHandler('incorrect username or password', 400));
    }

    const token = await sadmin.generateToken();

    res.status(200).json({
        success: true,
        sadmin,
        token,
        message: "login successfully"
    })

});

exports.superAdminProfile = catchAsyncErrors(async (req, res) => {

    const sadmin = await SuperAdmin.findById(req.superAdmin._id);

    res.status(200).json({
        success: true,
        sadmin
    })

});

exports.superAdminLogout = catchAsyncErrors(async (req, res) => {
    // console.log(localStorage.getItem('token'));
    res.status(200).json({
        success: true,
        message: "logged out successfully"
    })

});

// exports.deleteAdmin = catchAsyncErrors(async (req, res, next) => {

//     const admin = await Admins.findById(req.params.id);

//     if (!admin) {
//         return next(new ErrorHandler('admin not found', 404));
//     }

//     await Candidate.deleteMany({ owner: admin._id });

//     await Admins.deleteOne({ _id: admin._id });

//     res.status(200).json({
//         success: true,
//         message: "Admin Deleted"
//     })

// });