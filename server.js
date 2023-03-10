/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project. (Our own web server)
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const baseController = require("./controllers/baseController")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const util = require("./utilities")

/* ***********************
 * Middleware
 *************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(util.checkJWTToken)
  
 

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root


/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
// Index route
app.get("/", baseController.buildHome)
// Inventory routes
app.use("/inv", require("./routes/inventory-route"))
// Account routes
app.use("/client", require("./routes/account-route"))


// Message Display Challenge route
// app.use("/msg", require("./message/message-route") )
// console.log("Hit server.js.")


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on http:${host}:${port}`)
})
