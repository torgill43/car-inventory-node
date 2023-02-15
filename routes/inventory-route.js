// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController.js");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);

// Route to display inventory details
router.get("/detail/:inv_id", invController.buildVehicleDetails);

module.exports = router;