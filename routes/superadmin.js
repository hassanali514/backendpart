const express = require("express");
const {
    superAdminLogin,
    registerAdmins,
    superAdminLogout,
    deleteAdmin,
    getAllAdmins,
    getSingleAdmin,
    superAdminProfile
} = require("../controllers/superadmin");
const {
    isSuperAdminLogin,
    isSuperAdmin
} = require("../middlewares/auth");
const loginLimiter = require("../middlewares/loginLimiter");
const router = express.Router();

router.route('/admin/login').post(loginLimiter, superAdminLogin);
router.route('/register').post(isSuperAdminLogin, isSuperAdmin, registerAdmins);
router.route('/admin/logout').get(isSuperAdminLogin, isSuperAdmin, superAdminLogout);
router.route('/getallusers').get(isSuperAdminLogin, isSuperAdmin, getAllAdmins);
router.route('/getsingleuser/:id').get(isSuperAdminLogin, isSuperAdmin, getSingleAdmin);
router.route('/admin/profile').get(isSuperAdminLogin, isSuperAdmin, superAdminProfile);


module.exports = router;