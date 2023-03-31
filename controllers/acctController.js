const utilities = require("../utilities")
const acctModel = require("../models/account-model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
**************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("clients/login", {
      title: "Login",
      nav,
      errors: null,
      message: null,
    })
  }

/* ****************************************
*  Deliver registration view
**************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("clients/register", {
    title: "Register",
    nav,
    errors: null,
    message: null,
  })
}

/* ****************************************
 *  Process registration request
 **************************************** */
async function processRegistration(req, res, next) {
  let nav = await utilities.getNav()
  const { client_firstname, client_lastname, client_email, client_password } =
    req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10)
  } catch (error) {
    res.status(500).render("clients/register", {
      title: "Registration",
      nav,
      message: 'Sorry, there was an error processing the registration.',
      errors: null,
    })
  }

  const regResult = await acctModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  )
  // console.log(regResult)
  if (regResult) {
    res.status(201).render("clients/login.ejs", {
      title: "Login",
      nav,
      message: `Congratulations, ${client_firstname}, you\'re registered! Please log in.`,
      errors: null,
    })
  } else {
    const message = "Sorry, the registration failed."
    res.status(501).render("clients/register.ejs", {
      title: "Registration",
      nav,
      message,
      errors: null,
    })
  }
}  

/* ****************************************
*  Deliver Account Management view
**************************************** */
async function buildAcctManage(req, res, next) {
  let nav = await utilities.getNav()
  res.render("clients/acctManage", {
    title: "Account Management",
    nav,
    errors: null,
    message: null,
  })
}

/* ****************************************
*  Deliver Update Account Info view
**************************************** */
async function buildAcctEdit(req, res, next) {
  let client_email = req.params.client_email
  let nav = await utilities.getNav()
  let clientData = await acctModel.getClientId(client_email)
  console.log(`clientData: ${clientData[0].client_id}`)
  res.render("clients/update-client", {
    title: "Update Account Information",
    nav,
    errors: null,
    message: null,
    client_id: clientData[0].client_id,
    client_firstname: clientData[0].client_firstname,
    client_lastname: clientData[0].client_lastname,
    client_email: clientData[0].client_email
  })
}

/* ****************************************
* Process Edit Account request
**************************************** */
async function updateAcctInfo(req, res, next) {
  let nav = await utilities.getNav()
  const { 
    client_id,
    client_firstname,
    client_lastname,
    client_email
   } = req.body

  const editAcctResult = await acctModel.editAcct (
    client_id,
    client_firstname,
    client_lastname,
    client_email
  )
  console.log(`editAcctResult: ${editAcctResult}`)

  res.clearCookie("jwt")
  const clientData = await acctModel.getClientByEmail(client_email)
  console.log(`clientDatajwt: ${clientData}`)
  const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", accessToken, { httpOnly: true })
  res.redirect("/client/")

  if (editAcctResult) {
    // const clientName = client_firstname + " " + client_lastname
    res.status(201).render("clients/acctManage.ejs", {
        title: "Account Management",
        nav,
        message: `Your information has been updated.`,
        errors: null,
    })
  } else {
    // const clientName = client_firstname + " " + client_lastname
    const message = "Sorry, the update failed."
    res.status(501).render("clients/update-client.ejs", {
      title: "Update Account Information",
      nav,
      errors: null,
      message: null,
      client_id: clientData[0].client_id,
      client_firstname: clientData[0].client_firstname,
      client_lastname: clientData[0].client_lastname,
      client_email: clientData[0].client_email
    })
  }
}  

/* ****************************************
* Process Edit Password request
**************************************** */
async function updatePass(req, res, next) {
  let nav = await utilities.getNav()
  const { 
    client_id,
    client_password
   } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // pass regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(client_password, 10)
  } catch (error) {
    res.status(500).render("clients/acctManage.ejs", {
      title: "Account Management",
      nav,
      message: 'Sorry, there was an error processing the request.',
      errors: null,
    })
  }
  console.log(hashedPassword)
  const editPassResult = await acctModel.editPass (
    client_id,
    hashedPassword
  )
  console.log(`editPassResult: ${editPassResult}`)

  if (editPassResult) {
    // const clientName = client_firstname + " " + client_lastname
    res.status(201).render("clients/acctManage.ejs", {
        title: "Account Management",
        nav,
        message: `Your information has been updated. Please log out and log back in using the new credentials.`,
        errors: null,
    })
  } else {
    // const clientName = client_firstname + " " + client_lastname
    const message = "Sorry, the update failed."
    res.status(501).render("clients/update-client.ejs", {
      title: "Update Account Information",
      nav,
      errors: null,
      message: null,
      client_id: clientData[0].client_id,
      client_firstname: clientData[0].client_firstname,
      client_lastname: clientData[0].client_lastname,
      client_email: clientData[0].client_email
    })
  }
}  


/* ****************************************
 *  Process login request
 * ************************************ */
async function loginClient(req, res) {
  let nav = await utilities.getNav()
  const { client_password, client_email } = req.body
  // console.log(client_password)
  const clientData = await acctModel.getClientByEmail(client_email)
  // console.log(clientData.client_password)
  if (!clientData) {
    const message = "Please check your credentials and try again."
    res.status(400).render("client/login", {
      title: "Login",
      nav,
      message,
      errors: null,
      client_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password
      const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      res.cookie("jwt", accessToken, { httpOnly: true })
      return res.redirect("/client/")
    }
  } catch (error) {
    return res.status(403).send('Access Forbidden')
  }
}

/* ****************************************
*  Log user out
**************************************** */
async function logoutClient(req,res, next) {
  res.clearCookie("jwt")
  return res.redirect("/")
}

  module.exports = { 
    buildLogin, 
    buildRegister, 
    processRegistration, 
    loginClient, 
    buildAcctManage,
    logoutClient,
    buildAcctEdit,
    updateAcctInfo,
    updatePass
   }