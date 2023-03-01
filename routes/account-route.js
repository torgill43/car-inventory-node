// Needed Resources
const express = require("express")
const router = new express.Router()
const util = require("../utilities")
const acctController = require("../controllers/acctController.js");
const regValidate = require('../utilities/account-validation')

// Route to build login view
router.get("/login", acctController.buildLogin);

// Route to build the registration view
router.get("/register", acctController.buildRegister)
router.post(
    "/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    acctController.processRegistration)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    },
  )


module.exports = router;