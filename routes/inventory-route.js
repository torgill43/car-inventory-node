// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController.js")
const invValidate = require("../utilities/inventory-validation")
const util = require("../utilities")


// Route to build inventory by classification view
router.get("/type/:classificationId", util.handleErrors(invController.buildByClassification));

// Route to display inventory details
router.get("/detail/:inv_id", util.handleErrors(invController.buildVehicleDetails));

// Route to display management view
router.get("/", 
    util.jwtAuth,
    util.checkClientLogin,
    util.handleErrors(invController.deliverManagementView));

// Route to add classification
router.get("/add-class", util.handleErrors(invController.buildAddClass))
router.post("/add-class",
    invValidate.addClassRules(),
    invValidate.checkAddClassData,
    util.handleErrors(invController.processAddClass))

// Route to add vehicle
router.get("/add-vehicle", util.handleErrors(invController.buildAddVehicle))
router.post("/add-vehicle", 
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    util.handleErrors(invController.processAddVehicle))

// Routes to EDIT/DELETE vehicle/vehicle info
// Route to deliver EDIT view
router.get("/edit/:inv_id", util.handleErrors(invController.editVehicleInfo))
// Route to process EDITS
router.post("/edit", 
    invValidate.addVehicleRules(),
    invValidate.checkEditVehicleData,
    invController.processEditVehicle)
// Route to deliver DELETE view
router.get("/delete/:inv_id", util.handleErrors(invController.buildDeleteVehicle))
// Route to process DELETE
router.post("/delete/", util.handleErrors(invController.processVehicleDeletion))


// Error route
router.get("/error", util.handleErrors(invController.buildByClassificationError))

// Route to edit the inventory data
router.get("/getVehicles/:classification_id", invController.getVehiclesJSON)

module.exports = router;