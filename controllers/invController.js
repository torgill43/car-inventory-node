const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ****************************************
* Deliver the Classification Page
**************************************** */
invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehichlesByClassificationId(classificationId)
    console.log(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    console.log(`classname: ${className}`)
    res.render("./inventory/classification-view", {
        title: className + " Vehicles",
        nav,
        message: null,
        data,
    })
}

/* ****************************************
* Deliver the individual vehicle page
**************************************** */
invCont.buildVehicleDetails = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    console.log(inv_id)
    let data = await invModel.getVehicleDetails(inv_id)
    let nav = await utilities.getNav()
    let vehicleDisplay = await utilities.buildVehiclePage(data[0])
    console.log(vehicleDisplay)
    const vehicleMake = data[0].inv_make
    const vehicleModel = data[0].inv_model
    const vehicleYear = data[0].inv_year
    res.render("./inventory/vehicle-detail", {
        title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
        nav,
        message: null,
        data,
        vehicleDisplay,
    })
}

/* ****************************************
* Deliver the Management View
**************************************** */
invCont.deliverManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management-view", {
        title: "Vehicle Management",
        nav,
        errors: null,
        message: null,
    })
}

/* ****************************************
* Deliver the Add Classification View
**************************************** */
invCont.buildAddClass = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification-view", {
        title: "Add New Classification",
        nav,
        errors: null,
        message: null,
    })
}

/* ****************************************
* Process Add Classification request
**************************************** */
invCont.processAddClass = async function (req, res, next) {
    const {classification_name} = req.body
  
    const addClassResult = await invModel.addClass(classification_name)
    let nav = await utilities.getNav()
    // console.log(addClassResult)
    if (addClassResult) {
        res.status(201).render("inventory/management-view.ejs", {
          title: "Vehicle Management",
          nav,
          message: `'${classification_name}' has been added.`,
          errors: null,
        })
    } else {
        const message = "Sorry, the classification addition failed."
        res.status(501).render("inv/add-classification-view.ejs", {
          title: "Add New Classification",
          nav,
          message,
          errors: null,
        })
    }
}

/* ****************************************
* Deliver the Add Vehicle View
**************************************** */
invCont.buildAddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let data = await invModel.getClassifications()
    // console.log(`Data: ${data.rows}`)
    let dropdown = await utilities.buildClassificationDropdown(data)
    console.log(`Display: ${dropdown}`)
    res.render("./inventory/add-vehicle-view", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        message: null,
        dropdown,
    })
}

/* ****************************************
* Process Add Vehicle request
**************************************** */
invCont.processAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id } = req.body

  const addVehicleResult = await invModel.addNewVehicle (
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )
//   console.log(addVehicleResult)
  if (addVehicleResult) {
    res.status(201).render("inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        message: `'${inv_make} ${inv_model}' has been added.`,
        errors: null,
    })
  } else {
    const message = "Sorry, the vehicle addition failed."
    res.status(501).render("inv/add-vehicle-view.ejs", {
      title: "Add New Vehicle",
      nav,
      message,
      errors: null,
    })
  }
}  

module.exports = invCont;