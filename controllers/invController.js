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

module.exports = invCont;