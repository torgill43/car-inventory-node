const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* *****************************************
* Constructs the nav HTML unordered list
****************************************** */
Util.buildNav = function (data) {
    let list = "<ul>"
    list += '<li class="navlink"><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += '<li class="navlink">'
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}
/* *****************************************
* Builds the navigation bar
****************************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    nav = Util.buildNav(data)
    return nav
}

/* *****************************************
* Builds the individual vehicle display
****************************************** */
Util.buildVehiclePage = function (data) {
    let display = `
    <div class="details-cont">
        <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
        <div class="table-info">
            <h2 class="detail-title">${data.inv_make} ${data.inv_model} Details</h2>
            <table>
                <tr><td>Price: $<span>${new Intl.NumberFormat('en-US').format(data.inv_price)}</span></td></tr>
                <tr><td>Description: ${data.inv_description}</td></tr>
                <tr><td>Color: ${data.inv_color}</td></tr>
                <tr><td>Miles: <span>${new Intl.NumberFormat('en-US').format(data.inv_miles)}</span></td></tr>
            </table>
        </div>
    </div>
    `  
    return display
}

/* **************************************************************
* Builds the Classification select section of Add Vehicle form
************************************************************** */
Util.buildClassificationDropdown = function (data, classification_id = null) {
    let display = `
    <label for="classification_id">Classification</label>
    <select id="classification_id" name="classification_id" required>
    <option value="">Select a Classification...</option>`
    data.rows.forEach((row) => {
        display += `<option value="${row.classification_id}"
         ${(classification_id != null && row.classification_id == classification_id)? " selected ":""}
         >${row.classification_name}</option>`
    })
    display += `</select>`
    
    return display
}

/* ****************************************
* Middleware to check token validity
* (Register process)
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt, 
            process.env.ACCESS_TOKEN_SECRET, 
            function (err, clientData) {
                if (err) {
                    res.clearCookie("jwt")
                    return res.redirect("/client/login")
                }
            res.locals.clientData = clientData      
            res.locals.loggedin = 1
            next()
            })
    } else {
        next()
    } 
}

/* ****************************************
 *  Authorize JWT Token
 *  (Login process)
 * ************************************ */
Util.jwtAuth = (req, res, next) => {
    const token = req.cookies.jwt
    try {
      const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.clientData = clientData
        console.log(clientData)

        if (clientData.client_type == 'Employee' || clientData.client_type == 'Admin')
        {
            res.locals.clientAuthorized = 1
            next()
        } else {
            res.locals.clientAuthorized = 0
            next()
            // return res.status(403).redirect("/client/login")            
        }
    } catch (error){
        res.clearCookie("jwt", { httpOnly: true })
        return res.status(403).redirect("/client/login")
    }

}
  
/* ****************************************
 *  Middleware to check for client login
 *  (Check if user is logged in)
 * ************************************ */
Util.checkClientLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        next()
    } else {
        return res.redirect("/client/login")
    }
}

/* ****************************************
 *  Middleware to check client level
 *  (Check if user is logged in)
 * ************************************ */
// Util.validClient = (req, res, next) => {

// }

module.exports = Util












// Build message
// Util.getMessage = function () {
//     let message = "<h1>You're Done!</h1>"
//     return message
// }
// console.log("Hit utilities.")