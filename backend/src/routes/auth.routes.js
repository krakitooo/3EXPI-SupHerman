const express = require("express");
const {
    loginController,
    verifyInviteController,
    setPasswordController,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", loginController);
router.get("/invite/:token", verifyInviteController);
router.post("/set-password", setPasswordController);

module.exports = router;