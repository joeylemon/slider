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
        var loc = $(this).html();

        try{
            $("#dist").html(Calculations.distanceToLoc(loc).toFixed(3) + " cm");
            $("#angle").html(Calculations.angleToLoc(loc).toFixed(3) + "&deg;");
            $("#deflection").html(Calculations.deflectionToLoc(loc).toFixed(3) + " mm");
            drawToLoc(loc);
        }catch(ex){
            console.log("Not a location.");
        }
    }
}).on('touchmove', function (e) {
    touchmoved = true;
}).on('touchstart', function (e) {
    touchmoved = false;
});