const express = require("express");
const { requireAuth } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const { createAccountController } = require("../controllers/users.controller");

const router = express.Router();

router.post("/", requireAuth, requireRole("MANAGER"), createAccountController);

module.exports = router;