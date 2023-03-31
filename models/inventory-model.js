const pool = require("../database")


async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getVehicleByClassificationId(classificationId) {
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
        console.log("inv_id: " + inventoryId)
        const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1;", [inventoryId])
        console.log("data: " + data.rows)
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

/* ****************************** */
/* CHECK FOR EXISTING CLASSIFICATION */
/* ****************************** */
async function checkExistingClass(classification_name){
    try {
      const sql = "SELECT * FROM classification WHERE classification_name = $1"
      const email = await pool.query(sql, [classification_name])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }

/* ****************************** */
/* EDIT VEHICLE */
/* ****************************** */
async function editVehicle(
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
) {
    try {
        const sql = 
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11"
        const data = await pool.query(sql, [
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color, 
            classification_id,
            inv_id
        ])
        console.log(`data: ${data.rows}`)
        return data
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ****************************** */
/* DELETE VEHICLE */
/* ****************************** */
async function deleteVehicle(inv_id) {
    try {
        const sql = 
            "DELETE FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        console.error("model error: " + error)
        // next(error)
    }
}

module.exports = {
    getClassifications, 
    getVehicleByClassificationId, 
    getVehicleDetails, 
    addClass, 
    addNewVehicle, 
    checkExistingClass, 
    editVehicle,
    deleteVehicle
};