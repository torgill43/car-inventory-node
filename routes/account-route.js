// Needed Resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities")
const acctController = require("../controllers/acctController.js");
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", util.handleErrors(acctController.buildLogin));

// Route to log user out
router.get("/logout", util.handleErrors(acctController.logoutClient));

// Route to build account management view
router.get("/", 
  util.jwtAuth,
  util.handleErrors(acctController.buildAcctManage));

// Route to edit account info
router.get("/update-info/:client_email", util.handleErrors(acctController.buildAcctEdit))
  //Route to update info
router.post("/", 
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  util.jwtAuth,
  acctController.updateAcctInfo)
  // Route to update password
router.post("/update-pass", 
  regValidate.updatePassRules(),
  regValidate.checkUpdatePass,
  util.jwtAuth,
  util.handleErrors(acctController.updatePass)
  )

// Route to build the registration view
router.get("/register", util.handleErrors(acctController.buildRegister))
router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    util.handleErrors(acctController.processRegistration))

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    util.handleErrors(acctController.loginClient)
  )

module.exports = router;