const utilities = require("./")
const { body, validationResult } = require("express-validator")
const validate = {}
const acctModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("client_firstname")
        .trim()
        .isString()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("client_lastname")
        .trim()
        .isString()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await acctModel.checkExistingEmail(client_email)
        if (emailExists){
            throw new Error("Email exists. Please login or use different email.")
        }
    }),
 
      // password is required and must be strong password
      body("client_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/*  **********************************
 *  Check data and return errors or continue to registration
 * ********************************* */
validate.checkRegData = async (req, res, next) => {
    const {client_firstname, client_lastname, client_email } = req.body
    let errors = []
    errors = validationResult (req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("../views/clients/register", {
            errors,
            message: null,
            title: "Registration",
            nav,
            client_firstname,
            client_lastname,
            client_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await acctModel.checkExistingEmail(client_email)
        if (emailExists === 0){
            throw new Error("Email not found. Please try a different email.")
        }
    }),
 
      // password is required and must be strong password
      body("client_password")
        .trim()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
  }

/*  **********************************
 *  Check data and return errors or continue to login
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
    const { client_email } = req.body
    let errors = []
    errors = validationResult (req)
    // console.log(errors)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("../views/clients/login", {
            errors,
            message: null,
            title: "Login",
            nav,
            client_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Client Info Update Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .isString()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .isString()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("client_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (client_email) => {
      const emailExists = await acctModel.checkExistingEmail(client_email)
      if (emailExists){
          throw new Error("Email exists. Please enter a new email.")
      }
    })
  ]
}

/*  **********************************
 *  Check data and return errors or continue to update
 * ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const {client_firstname, client_lastname, client_email } = req.body
  let errors = []
  errors = validationResult (req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("../views/clients/update-client", {
          errors,
          message: null,
          title: "Update Account Information",
          nav,
          client_firstname,
          client_lastname,
          client_email,
      })
      return
  }
  next()
}

/*  **********************************
 *  Update Password Validation Rules
 * ********************************* */
validate.updatePassRules = () => {
  return [
    // password is required and must be strong password
    body("client_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.")
  ]
}

/*  **********************************
 *  Check data and return errors or continue to update
 * ********************************* */
validate.checkUpdatePass = async (req, res, next) => {
  let errors = []
  errors = validationResult (req)
  // console.log(errors)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("../views/clients/update-client", {
          errors,
          message: null,
          title: "Update Account Information",
          nav,
      })
      return
  }
  next()
}

module.exports = validate;