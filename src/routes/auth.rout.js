const express = require("express");
const router = express.Router();
const usersController = require("../controllers/auth.controller");

router.post("/login", usersController.login);
router.get("/", usersController.getAllUsers);
router.post("/", usersController.createUser)

module.exports = router;
