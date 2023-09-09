const Candidate = require("../models/Candidates");
const path = require("path");
const Admins = require("../models/Admins");
const fs = require('fs');
// const sjh = require('../public/uploads')

const {
    checkMissingAttributes,
    checkEmptyAttributes,
} = require("../utils/requestBody");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

exports.createCandidate = catchAsyncErrors(async (req, res, next) => {

    const requestBody = [
        "name",
        "fatherName",
        "passportNo",
        "dateOfBirth",
        "passportExpiryDate",
        "nationality",
        "trade",
        "careOf",
        "status",
    ];
    const requestFiles = ["passportImage1", "passportImage2", "imageUrl", "cnicImageUrl"];
    // const imageFormats = JSON.parse(process.env.IMAGE_FORMATS);
    if (req.files.visaImageUrl) {
        requestFiles.push("visaImageUrl")
    }
    if (req.files.cvImageUrl) {
        requestFiles.push("cvImageUrl")
    }
    if (req.files.licenseImageUrl) {
        requestFiles.push("licenseImageUrl")
    }
    const missingAttribute = checkMissingAttributes(req.body, requestBody);
    if (missingAttribute != null) {
        return next(new ErrorHandler(`${missingAttribute} not found in request body!`, 400));;
    }
    const emptyAttributes = checkEmptyAttributes(req.body, requestBody);
    if (emptyAttributes != null) {
        return next(new ErrorHandler(`${emptyAttributes} was empty in request body!`, 400));
    }
    const missingFiles = checkMissingAttributes(req.files, requestFiles);
    if (missingFiles != null) {
        return next(new ErrorHandler(`${missingFiles} is missing in request files!`, 400));
    }



    if (req.body.royaltyFee && req.body.royaltyFee < 0 || req.body.royaltyFee > 100) {
        fileManager.DeleteFile(req.files.thumbnail[0].path);
        return next(new ErrorHandler('Inappropriate royalty fees value set. It must be a percentage.', 400));
    }


    for (const key in req.files) {
        if (!process.env.IMAGE_FORMATS.includes(path.extname(req.files[key][0].originalname))) {
            return next(new ErrorHandler('Invalid format of image Url.', 400));
        }
    }

    console.log("FIles : ", req.files)


    const candidateData = {
        name: req.body.name,
        fatherName: req.body.fatherName,
        passportNo: req.body.passportNo,
        dateOfBirth: req.body.dateOfBirth,
        passportExpiryDate: req.body.passportExpiryDate,
        nationality: req.body.nationality,
        trade: req.body.trade,
        careOf: req.body.careOf,
        status: req.body.status,
        owner: req.admin._id,
        imageUrl: req.files.imageUrl[0].path,
        passportImage1: req.files.passportImage1[0].path,
        passportImage2: req.files.passportImage2[0].path,
        cnicImageUrl: req.files.cnicImageUrl[0].path
    }

    if (req.files.visaImageUrl) {
        candidateData.visaImageUrl = req.files.visaImageUrl[0].path
    }
    if (req.files.cvImageUrl) {
        candidateData.cvImageUrl = req.files.cvImageUrl[0].path
    }
    if (req.files.licenseImageUrl) {
        candidateData.licenseImageUrl = req.files.licenseImageUrl[0].path
    }

    const newCandidate = await Candidate.create(candidateData);

    const admin = await Admins.findById(req.admin._id);

    admin.record.push(newCandidate._id);

    await admin.save();

    res.status(201).json({
        success: true,
        // candidate: newCandidate,
        // admins: admin,
        message: 'Created Successfully'
    })
});

exports.deleteCandidate = catchAsyncErrors(async (req, res, next) => {

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
        return next(new ErrorHandler('candidate not found', 404));
    }

    if (candidate.owner.toString() !== req.admin._id.toString()) {
        return next(new ErrorHandler('unauthorize', 401));
    }

    await Candidate.deleteOne({ _id: candidate._id });

    const admin = await Admins.findById(req.admin._id);

    const index = admin.record.indexOf(req.params.id)

    admin.record.splice(index, 1);

    await admin.save();

    res.status(200).json({
        success: true,
        message: "candidate deleted"
    })
});

exports.getCandidatesOfAdmin = catchAsyncErrors(async (req, res) => {

    const admin = await Admins.findById(req.admin._id);

    const candidates = await Candidate.find({
        "owner": {
            $in: admin._id
        }
    });

    res.status(200).json({
        success: true,
        candidates,
        admin: admin.record,
    })
});


// @define: work remaining on image update
exports.updateCandidate = catchAsyncErrors(async (req, res, next) => {

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
        return next(new ErrorHandler('candidate not found', 404));
    }

    if (candidate.owner.toString() !== req.admin._id.toString()) {
        return next(new ErrorHandler('unauthorize', 401));
    }

    let result = await Candidate.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )

    res.status(200).json({
        success: true,
        result,
        message: "candidate updated"
    })
});

exports.getSingleCandidateOfAdmin = catchAsyncErrors(async (req, res, next) => {

    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
        return next(new ErrorHandler('candidate not found', 404));
    }

    if (candidate.owner.toString() !== req.admin._id.toString()) {
        return next(new ErrorHandler('unauthorize', 401));
    }

    res.status(200).json({
        success: true,
        candidate
    })

})

exports.downloadFile = catchAsyncErrors(async (req, res, next) => {

    // console.log("TEST")
    
    const filename = req.params.filename;

    let filePath = path.dirname(__dirname);
    filePath = path.join(filePath,`/public/uploads/${filename}`)
    console.log(filePath);
    res.download(filePath);
})