const express = require("express");
const {
    adminLogin,
    adminLogout,
    resetAdminPassword,
    forgetAdminPassword,
    resetAdminForgetPassword,
    adminProfile
} = require("../controllers/admins");
const {
    isAdminLogin,
    isAdmin
} = require("../middlewares/auth");
const router = express.Router();

router.route('/user/login').post(adminLogin);
router.route('/user/logout').get(isAdminLogin, isAdmin, adminLogout);
router.route('/user/profile').get(isAdminLogin, isAdmin, adminProfile);
router.route('/user/update/password').patch(isAdminLogin, isAdmin, resetAdminPassword);
// router.route('/forgot/password').post(forgetAdminPassword);
// router.route('/password/reset/:token').patch(resetAdminForgetPassword);

module.exports = router;