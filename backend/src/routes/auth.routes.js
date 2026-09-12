const express = require("express");
const {
    loginController,
    verifyInviteController,
    setPasswordController,
} = require("../controllers/auth.controller");
const { loginLimiter } = require("../middlewares/rateLimit.middleware");

const router = express.Router();

router.post("/login", loginLimiter, loginController);
router.get("/invite/:token", verifyInviteController);
router.post("/set-password", setPasswordController);

module.exports = router;