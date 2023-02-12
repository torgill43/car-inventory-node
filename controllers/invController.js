const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

invCont.buildByClassification = async function (req, res, next) {
    const classificationId = req.params.classificationId
    let data = await invModel.getVehichlesByClassificationId(classificationId)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification-view", {
        title: className + " Vehicles",
        nav,
        message: null,
        data,
    })
}

// const invDetails = {}

invCont.displayVehicleDetails = async function (req, res, next) {
    const inventoryId = req.params.inventoryId;
    let data = await invModel.getVehicleDetails(inventoryId)
    // let nav = await utilities.getNav()
    let vehicleDisplay = await utilities.displayVehicles(data)
    const vehicleMake = data[0].inv_make
    const vehicleModel = data[0].inv_model
    const vehicleYear = data[0].inv_year
    res.render("./inventory/vehicle-detail", {
        title: vehicleYear + vehicleMake + vehicleModel,
        vehicleDisplay,
        message: null,
        data,
    })
}

module.exports = invCont;