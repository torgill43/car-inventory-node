// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController.js")
const invValidate = require("../utilities/inventory-validation")
const util = require("../utilities")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);

// Route to display inventory details
router.get("/detail/:inv_id", invController.buildVehicleDetails);

// Route to display management view
router.get("/", 
    util.jwtAuth,
    invController.deliverManagementView);

// Route to add classification
router.get("/add-class", invController.buildAddClass)
router.post("/add-class",
    invValidate.addClassRules(),
    invValidate.checkAddClassData,
    invController.processAddClass)

// Route to add vehicle
router.get("/add-vehicle", invController.buildAddVehicle)
router.post("/add-vehicle", 
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    invController.processAddVehicle)

module.exports = router;