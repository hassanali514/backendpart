const express = require("express");
const fileManager = require("../actions/fileUpload");

const {
	createCandidate,
	deleteCandidate,
	getCandidatesOfAdmin,
	updateCandidate,
	getSingleCandidateOfAdmin,
	downloadFile
} = require("../controllers/candidates");
const {
	isAdminLogin,
	isAdmin
} = require("../middlewares/auth");
const router = express.Router();

router.route('/candidates/createcandidates').post(isAdminLogin, isAdmin,
	fileManager.uploadDocument.fields([
		{
			name: "passportImage1",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
		{
			name: "passportImage2",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
		{
			name: "imageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
		{
			name: "visaImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
		{
			name: "cvImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
		{
			name: "cnicImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
		{
			name: "licenseImageUrl",
			maxCount: process.env.MAX_NO_OF_IMAGES,
		},
	]),
	createCandidate);
router.route('/candidate/delete/:id').delete(isAdminLogin, isAdmin, deleteCandidate);
router.route('/getallcandidates').get(isAdminLogin, isAdmin, getCandidatesOfAdmin);
router.route('/candidates/update/:id').patch(isAdminLogin, isAdmin, updateCandidate);
router.route('/candidates/getsinglecandidate/:id').get(isAdminLogin, isAdmin, getSingleCandidateOfAdmin);
router.route('/download/:filename').get(isAdminLogin, isAdmin, downloadFile)


module.exports = router;