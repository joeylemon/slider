/**
 * @file Handles the edit menu, allowing user to edit values used in calculations
 * @author Joey Lemon
 * 
 * EF 151: Team C216-2
 * Joey Lemon, Nicholas Crowder, William Ring, Alawy Alshakhouri
 */

// Listen for nav bar touch to change menu
var touchmove;
$('#nav-slider, #nav-edit').on('touchend', function (e) {
    if (!touchmove) {
        changeMenu(this);
    }
}).on('touchmove', function (e) {
    touchmove = true;
}).on('touchstart', function (e) {
    touchmove = false;
});

// Listen for nav bar click
// Used when user is on a desktop
$('#nav-slider, #nav-edit').on('click', function (e) {
    changeMenu(this);
});

// Change the menu based on the current element
function changeMenu(elem) {
    var other = "nav-edit";
    if(elem.id == "nav-edit") {
        other = "nav-slider";
    }
    $("#" + elem.id + "-div").show();
    $("#" + other + "-div").hide();

    $(elem).addClass("active");
    $("#" + other).removeClass("active");
}

// Save the original values we have calculated
// Used when user resets custom values
var orig_numbers = math_values;

// Set the stored numbers if there is any
var stored_numbers = getStoredNumbers();

// Set the current values to the stored values
math_values = stored_numbers;

/**
 * Stores the user's custom values
 */
function storeNumbers() {
    stored_numbers = math_values;
    window.localStorage.setItem("stored", JSON.stringify(stored_numbers));
}

/**
 * Gets the user's custom values
 * 
 * @return {Array} The array of values
 */
function getStoredNumbers() {
    var storage = window.localStorage.getItem("stored");
    if(storage) {
        return $.parseJSON(storage);
    }else{
        return orig_numbers;
    }
}

/**
 * Resets the storage to the original values
 */
function resetStorage() {
    window.localStorage.clear();
    location.reload();
}

// Set the input fields' placeholder text and value text
for(value in math_values) {
    $("#" + value).attr('placeholder', orig_numbers[value].toFixed(4));
    document.getElementById(value).value = stored_numbers[value].toFixed(4);
}

// Listen for input change to update current values
$('.edit-input').on('input', function() {
    var value = document.getElementById(this.id).value;
    if(value.length > 0) {
        math_values[this.id] = parseFloat(value);
    }else{
        math_values[this.id] = orig_numbers[this.id];
    }
    storeNumbers();
});