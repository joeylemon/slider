/**
 * @file Listens for user's inputs on the board to perform calculations
 * @author Joey Lemon
 * 
 * EF 151: Team C216-2
 * Joey Lemon, Nicholas Crowder, William Ring, Alawy Alshakhouri
 */

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    try {
        window.plugins.webviewcolor.change('#000000');
    } catch (e) {}
}

var touchmoved;
$('td, .ef-chip').on('touchend', function (e) {
    if (!touchmoved) {
        zoneSelect(this);
    }
}).on('touchmove', function (e) {
    touchmoved = true;
}).on('touchstart', function (e) {
    touchmoved = false;
});

$('td, .ef-chip').on('click', function (e) {
    zoneSelect(this);
});

function zoneSelect(elem) {
    var loc = $(elem).html();

    try{
        $("#dist").html(Calculations.distanceToLoc(loc).toFixed(3) + " cm");
        $("#angle").html(Calculations.angleToLoc(loc).toFixed(3) + "&deg;");
        $("#deflection").html(Calculations.deflectionToLoc(loc).toFixed(3) + " mm");
        drawToLoc(loc);
    }catch(ex){
        console.log("Not a location.");
    }
}