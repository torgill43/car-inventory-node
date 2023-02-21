const pool = require("../database")


async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getVehichlesByClassificationId(classificationId) {
    try {
        const data = await pool.query("SELECT * FROM public.inventory AS i JOIN public.classification AS c ON i.classification_id = c.classification_id WHERE i.classification_id = $1;", [classificationId])
        return data.rows
    } catch (error) {
        console.error('getclassificationsbyid error ' + error)
    }
}

/* ****************************************** */
/* Get Vehicle Details for individual view */
/* ****************************************** */
async function getVehicleDetails(inventoryId) {
    try {
        console.log(inventoryId)
        const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1;", [inventoryId])
        return data.rows
    } catch (error) {
        console.error('getvehicledetails error ' + error)
    }
}

/* ****************************** */
/* ADD NEW CLASS */
/* ****************************** */
async function addClass(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

/* ****************************** */
/* ADD NEW VEHICLE */
/* ****************************** */
async function addNewVehicle(
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
) {
    try {
        const sql = 
        "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [
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
        ])
    } catch (error) {
        return error.message
    }
}

module.exports = {getClassifications, getVehichlesByClassificationId, getVehicleDetails, addClass, addNewVehicle};