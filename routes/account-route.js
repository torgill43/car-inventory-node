// Needed Resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities")
const acctController = require("../controllers/acctController.js");

// Route to build login view
router.get("/login", acctController.buildLogin);

// Route to build the registration view
router.get("/register", acctController.buildRegister)
router.post("/register", acctController.processRegistration)


module.exports = router;