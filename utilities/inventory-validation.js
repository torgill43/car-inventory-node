const utilities = require("./")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  Add Classification Data Validation Rules
 * ********************************* */
validate.addClassRules = () => {
    return [
        // classification_name is required and must be string
        body("classification_name")
        .trim()
        // Is there an easier way to check if first letter is capitalized?
        // .custom((classification_name) => {
        //     regexp = '/^[A-Z]/';
        //     if (!regexp.test(classification_name))
        //     {
        //         throw new Error("First letter is not capitalized")
        //     }
        // })
        .escape()
        .isLength({ min: 1 })
        .withMessage("Empty value not allowed.") // on error this message is sent.
        .isAlpha()
        .withMessage("Only letters are allowed.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClass(classification_name)
            if (classExists){
                throw new Error("Classification already exists. Please enter a new one.")
            }
        }),
    ]
}

/*  **********************************
 *  Check data and return errors or continue to mgmt page
 * ********************************* */
validate.checkAddClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult (req)
    console.log(errors)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("../views/inventory/add-classification-view", {
            errors,
            message: null,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/*  **********************************
 *  Add Vehicle Data Validation Rules
 * ********************************* */
validate.addVehicleRules = () => {
    return [
        // Add rules for classification selection
        // body("classification_name")
        //     .custom(async (classification_id) => {
        //         if (!classification_id){}
        //             throw new Error("Must select a value from the list.")
        //         }),

        // inv_make must be provided
        body("inv_make")
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage("Please provide the vehicle make."), // on error this message is sent.

        // inv_model must be provided
        body("inv_model")
            .trim()
            .escape()
            .isLength({ min: 3 })
            .withMessage("Please provide the vehicle model."), // on error this message is sent.
        
        // inv_year must be provided and a number
        body("inv_year")
            .trim()
            .escape()
            .isInt({ gt: 1885 })
            // .isLength({ min: 4, max:4 })
            .withMessage("Please provide the vehicle year."), // on error this message is sent.
        
        // inv_description must be provided and a string
        body("inv_description")
            .trim()
            .escape()
            .isLength({ min: 1})
            .withMessage("Please provide the vehicle description."), // on error this message is sent.

        // inv_price must be provided and a decimal
        body("inv_price")
            .trim()
            .escape()
            .isDecimal({ decimal_digits: 2, no_symbols: true})
            .withMessage("Please provide the vehicle's price."), // on error this message is sent.

        // inv_miles must be provided and a number
        body("inv_miles")
            .trim()
            .escape()
            .isNumeric({ no_symbols: true})
            .withMessage("Please provide the vehicle's miles."), // on error this message is sent.
        
        // inv_miles must be provided and a number
        body("inv_color")
            .trim()
            .escape()
            .isLength({ min: 1})
            .withMessage("Please provide the vehicle's color.") // on error this message is sent.
    ]
}

/*  **********************************
 *  Check data and return errors or continue to add vehicle
 * ********************************* */
validate.checkAddVehicleData = async (req, res, next) => {
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
    let errors = []
    errors = validationResult (req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let data = await invModel.getClassifications()
        let dropdown = await utilities.buildClassificationDropdown(data)
        res.render("../views/inventory/add-vehicle-view", {
            title: "Add New Vehicle",
            nav,
            errors,
            message: null,
            dropdown,
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
        return
    }
    next()
}


module.exports = validate;
