// An array of all possible locations on the board
var locs={A1:{x:12.5,y:62.5},A2:{x:37.5,y:62.5},A3:{x:62.5,y:62.5},B1:{x:12.5,y:87.5},B2:{x:37.5,y:87.5},B3:{x:62.5,y:87.5},C1:{x:12.5,y:112.5},C2:{x:37.5,y:112.5},C3:{x:62.5,y:112.5},D1:{x:12.5,y:137.5},D2:{x:37.5,y:137.5},D3:{x:62.5,y:137.5},EF:{x:37.5,y:100}};

// Constant values that will never change
var chip_diameter = 3.96875; // cm
var origin = {
    x: 37.5,
    y: 25 - chip_diameter
};
var gravity = 9.79729;

// Values used in calculations
// Will likely change due to user input
var math_values = {
    spring_constant: (0.457 * gravity) / (0.0174625),
    coeff_kinetic_fric: 0.4667,
    coeff_resititution: 0.8,
    chip_mass: 0.0115,
    ef_chip_mass: 0.015
}

// A class to convert values
class Convertions {
    /**
     * Converts from centimeters to meters
     * 
     * @param {number} cm The amount of centimeters
     * @return {number} The amount of meters
     */
    cmToM(cm) {
        return cm / 100;
    }

    /**
     * Converts from meters to millimeters
     * 
     * @param {number} m The amount of meters
     * @return {number} The amount of millimeters
     */
    mToMM(m) {
        return m * 1000;
    }

    /**
     * Converts from grams to kilograms
     * 
     * @param {number} g The amount of grams
     * @return {number} The amount of kilograms
     */
    gToKg(g) {
        return g / 1000;
    }

    /**
     * Converts from kilograms to grams
     * 
     * @param {number} kg The amount of kilograms
     * @return {number} The amount of grams
     */
    kgToG(kg) {
        return kg * 1000;
    }
};
// Initialize the converter constant
const Converter = new Convertions();

// A class to compute device settings
class Computations {
    /**
     * Gets how much deflection the spring needs to shoot the chip
     * to a location
     * 
     * @param {Object} loc The location to get the deflection for
     * @return {number} The amount of deflection in millimeters
     */
    deflectionToLoc(loc) {
        var dist = Converter.cmToM(this.distanceToLoc(loc));
        if(loc != "EF"){
            // Use conservation of energy

            // 0.5kx^2 = µmgd
            var deflection = Math.sqrt( (math_values.coeff_kinetic_fric * math_values.chip_mass * gravity * dist) / (0.5 * math_values.spring_constant) );

            // Return deflection in millimeters
            return Converter.mToMM(deflection);
        }else{
            // Since the user wants to hit the ef chip, use conservation of energy
            // and conservation of momentum since there is a collision

            // The intended location where the ef chip will come to rest
            var target = {x: 37.5, y: 140};

            // Get the distance the ef chip needs to move
            var ef_move_dist = Converter.cmToM(this.distance(locs.EF, target));

            // 0.5mv^2 = µmgd
            var v_ef_final = Math.sqrt( (math_values.coeff_kinetic_fric * math_values.chip_mass * gravity * ef_move_dist) / (0.5 * math_values.chip_mass) );

            // mv + mv = mv + mv
            // coefficient of restitution
            var v_chip_initial = (math_values.chip_mass * v_ef_final + math_values.ef_chip_mass * v_ef_final) / (math_values.chip_mass + math_values.chip_mass * math_values.coeff_resititution);

            // 0.5mv^2 = 0.5mv^2 + µmgd
            var v_chip_launch = Math.sqrt( (0.5 * math_values.chip_mass * Math.pow(v_chip_initial, 2) + math_values.coeff_kinetic_fric * math_values.chip_mass * gravity * dist) / (0.5 * math_values.chip_mass) );

            // 0.5kx^2 = 0.5mv^2
            var deflection = Math.sqrt( (0.5 * math_values.chip_mass * Math.pow(v_chip_launch, 2)) / (0.5 * math_values.spring_constant) );
    
            // Return deflection in millimeters
            return Converter.mToMM(deflection);
        }
    }
    
    /**
     * Gets the distance between two points
     * 
     * @param {Object} p1 The first coordinates
     * @param {Object} p2 The second coordinates
     * @return {number} The distance between coordinates
     */
    distance(p1, p2) {
        return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    }
    
    /**
     * Gets the distance to a location
     * 
     * @param {Object} loc The location object
     * @return {number} The distance in centimeters
     */
    distanceToLoc(loc) {
        var loc = locs[loc.toUpperCase()];
        return this.distance(origin, loc);
    }
    
    /**
     * Gets the angle to a location
     * 
     * @param {Object} loc The location object
     * @return {number} The angle in degrees
     */
    angleToLoc(loc) {
        var loc = locs[loc.toUpperCase()];
        // arctan(delta y / delta x)
        return 90 - Math.atan(Math.abs((loc.y - origin.y) / (loc.x - origin.x))) * 180 / Math.PI;
    }
};
// Initialize the computations constant
const Calculations = new Computations();

/**
 * Prints all possible deflection values to console
 */
function printAllDeflectionValues() {
    var vals = new Array();
    for(loc in locs) {
        if(loc.indexOf("1") == -1){
            var deflection = Calculations.deflectionToLoc(loc).toFixed(3);
            var side = "center";
            if(loc.indexOf("3") != -1){
                side = "side";
            }else if(loc.indexOf("EF") != -1){
                side = "EF";
            }
            vals.push({deflection: deflection, side: side});
        }
    }

    var list = ""
    for(var i = vals.length - 1; i >= 0; i--){
        list += vals[i].deflection + "mm (" + vals[i].side + ")\n";
    }
    console.log(list);
}