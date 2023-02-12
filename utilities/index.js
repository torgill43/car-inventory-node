const invModel = require("../models/inventory-model")
const Util = {}

/* *****************************************
* Constructs the nav HTML unordered list
****************************************** */
Util.buildNav = function (data) {
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}
/* *****************************************
* Builds the navigation bar
****************************************** */
// This builds the site nav
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    nav = Util.buildNav(data)
    return nav
}

// Builds the individual vehicle display
Util.displayVehicles = async function (data) {
    let div = '<div class="details-cont>';
    div += '<img src=' + 
        data.inv_img + 
        'alt="Image of' +
        data.inv_make + data.inv_model + 
        '">';
    div += '<div class="table-info"><h2 class="detail-title">' +
        data.inv_make +
        data.inv_model +
        "Details</h2>";
    div += "<table><tr>Price:" +
        '<span> new Intl.NumberFormat("en-US").format(' +
        data.inv_price +
        ')</span></tr><tr>Description:' +
        data.inv_description + 
        '</tr><tr>Color:' +
        data.inv_color +
        '</tr><tr>Miles:' +
        data.inv_miles+ '</tr></table></div>';
    div += "</div>";

    return div;
}

module.exports = Util