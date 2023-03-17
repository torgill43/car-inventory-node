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
    util.handleErrors(invValidate.addClassRules()),
    util.handleErrors(invValidate.checkAddClassData),
    util.handleErrors(invController.processAddClass))

// Route to add vehicle
router.get("/add-vehicle", util.handleErrors(invController.buildAddVehicle))
router.post("/add-vehicle", 
    util.handleErrors(invValidate.addVehicleRules()),
    util.handleErrors(invValidate.checkAddVehicleData),
    util.handleErrors(invController.processAddVehicle))

router.get("/error", util.handleErrors(invController.buildByClassificationError))

module.exports = router;