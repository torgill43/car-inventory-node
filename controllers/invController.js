const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ****************************************
* Deliver the Classification Page
**************************************** */
invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehicleByClassificationId(classificationId)
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
* Deliver the Error version of Classification Page
**************************************** */
invCont.buildByClassificationError = async function (req, res, next) {
    // const classificationId = req.params.classificationId
    console.log("Classification Error hit.")
    let data = await invModel.getVehicleByClassificationId(classificationId)
    // console.log(data)
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
    let data = await invModel.getClassifications()
    let dropdown = await utilities.buildClassificationDropdown(data)
    res.render("./inventory/management-view", {
        title: "Vehicle Management",
        nav,
        errors: null,
        message: null,
        dropdown
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
    let classData = await invModel.getClassifications()
    let dropdown = await utilities.buildClassificationDropdown(classData)
    // console.log(addClassResult)
    if (addClassResult) {
        res.status(201).render("inventory/management-view.ejs", {
          title: "Vehicle Management",
          nav,
          message: `'${classification_name}' has been added.`,
          errors: null,
          dropdown
        })
    } else {
        const message = "Sorry, the classification addition failed."
        res.status(501).render("inv/add-classification-view.ejs", {
          title: "Add New Classification",
          nav,
          message,
          errors: null,
          dropdown
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
    // console.log(`Display: ${dropdown}`)
    res.render("./inventory/add-vehicle-view", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        message: null,
        dropdown,
        inv_image: null,
        img_thumbnail: null,
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
  let classData = await invModel.getClassifications()
  let dropdown = await utilities.buildClassificationDropdown(classData)
  if (addVehicleResult) {
    res.status(201).render("inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        message: `'${inv_make} ${inv_model}' has been added.`,
        errors: null,
        dropdown
    })
  } else {
    const message = "Sorry, the vehicle addition failed."
    res.status(501).render("inventory/add-vehicle-view.ejs", {
      title: "Add New Vehicle",
      nav,
      dropdown,
      message,
      errors: null,
    })
  }
}  

/* ***************************
 *  Return Vehicles by Classification As JSON
 * ************************** */
invCont.getVehiclesJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  // console.log(classification_id)
  const vehicleData = await invModel.getVehicleByClassificationId(classification_id)
  // console.log(vehicleData)
  if (vehicleData[0].inv_id) {
    return res.json(vehicleData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ****************************************
* Deliver the Edit Vehicle View
**************************************** */
invCont.editVehicleInfo = async function (req, res, next) {
  let inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let vehicleData = await invModel.getVehicleDetails(inv_id)
  console.log(`vehicleData: ${vehicleData[0]}`)
  let classData = await invModel.getClassifications()
  // console.log(`Data: ${classData.rows}`)
  let dropdown = await utilities.buildClassificationDropdown(classData, vehicleData[0].classification_id)
  // console.log(`Display: ${dropdown}`)
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("./inventory/edit-vehicle-view", {
      title: `Edit ${vehicleName}`,
      nav,
      errors: null,
      message: null,
      dropdown: dropdown,
      inv_id: vehicleData[0].inv_id,
      inv_make: vehicleData[0].inv_make,
      inv_model: vehicleData[0].inv_model,
      inv_year: vehicleData[0].inv_year,
      inv_description: vehicleData[0].inv_description,
      inv_image: vehicleData[0].inv_image,
      inv_thumbnail: vehicleData[0].inv_thumbnail,
      inv_price: vehicleData[0].inv_price,
      inv_miles: vehicleData[0].inv_miles,
      inv_color: vehicleData[0].inv_color,
      classification_id: vehicleData[0].classification_id
  })
}

/* ****************************************
* Process Edit Vehicle request
**************************************** */
invCont.processEditVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_id,
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

  const editVehicleResult = await invModel.editVehicle (
    inv_id,
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color, 
    classification_id
  )
  console.log(editVehicleResult)
  if (editVehicleResult) {
    const vehicleName = inv_make + " " + inv_model
    const data = await invModel.getClassifications()
    let dropdown = await utilities.buildClassificationDropdown(data)
    res.status(201).render("inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        dropdown,
        message: `'${vehicleName}' has been updated.`,
        errors: null,
    })
  } else {
    // const inv_id = inv_id
    const data = await invModel.getClassifications()
    let dropdown = await utilities.buildClassificationDropdown(data)
    const vehicleName = `${inv_make} ${inv_model}`
    const message = "Sorry, the vehicle update failed."
    res.status(501).render("inventory/edit-vehicle-view.ejs", {
      title: `Edit ${vehicleName}`,
      nav,
      message: message,
      errors: null,
      dropdown,
      inv_id,
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
    })
  }
}  

/* ****************************************
* Deliver the Delete Vehicle View
**************************************** */
invCont.buildDeleteVehicle = async function (req, res, next) {
  let inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let vehicleData = await invModel.getVehicleDetails(inv_id)
  console.log(`vehicleData: ${vehicleData[0]}`)
  let classData = await invModel.getClassifications()
  // console.log(`Data: ${classData.rows}`)
  let dropdown = await utilities.buildClassificationDropdown(classData, vehicleData[0].classification_id)
  // console.log(`Display: ${dropdown}`)
  const vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
      title: `Delete ${vehicleName}`,
      nav,
      errors: null,
      message: null,
      dropdown: dropdown,
      inv_id: vehicleData[0].inv_id,
      inv_make: vehicleData[0].inv_make,
      inv_model: vehicleData[0].inv_model,
      inv_year: vehicleData[0].inv_year,
      inv_price: vehicleData[0].inv_price,
      // classification_id: vehicleData[0].classification_id
  })
}

/* ****************************************
* Process Delete Vehicle request
**************************************** */
invCont.processVehicleDeletion = async function (req, res, next) {
  let nav = await utilities.getNav()
  // let inv_id = parseInt(req.params.inv_id)
  // console.log(`inv_id: ${inv_id}`)
  const { 
    inv_id,
    inv_make, 
    inv_model, 
    inv_year,
    inv_price } = req.body

  const deleteVehicleResult = await invModel.deleteVehicle(inv_id)
  console.log(deleteVehicleResult)
  if (deleteVehicleResult) {
    const vehicleName = inv_make + " " + inv_model
    const data = await invModel.getClassifications()
    let dropdown = await utilities.buildClassificationDropdown(data)
    res.status(201).render("inventory/management-view.ejs", {
        title: "Vehicle Management",
        nav,
        dropdown,
        message: `'${vehicleName}' has been deleted.`,
        errors: null,
    })
  } else {
    // const inv_id = inv_id
    const data = await invModel.getClassifications()
    let dropdown = await utilities.buildClassificationDropdown(data)
    const vehicleName = `${inv_make} ${inv_model}`
    const message = "Sorry, the vehicle deletion failed."
    res.status(501).render("inventory/delete-confirm.ejs", {
      title: `Edit ${vehicleName}`,
      nav,
      message: message,
      errors: null,
      dropdown,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price
    })
  }
}  


module.exports = invCont;