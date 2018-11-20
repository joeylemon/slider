var locs = {
    A1: {
        x: 12.5,
        y: 62.5
    },
    A2: {
        x: 37.5,
        y: 62.5
    },
    A3: {
        x: 62.5,
        y: 62.5
    },
    B1: {
        x: 12.5,
        y: 87.5
    },
    B2: {
        x: 37.5,
        y: 87.5
    },
    B3: {
        x: 62.5,
        y: 87.5
    },
    C1: {
        x: 12.5,
        y: 112.5
    },
    C2: {
        x: 37.5,
        y: 112.5
    },
    C3: {
        x: 62.5,
        y: 112.5
    },

    D1: {
        x: 12.5,
        y: 137.5
    },
    D2: {
        x: 37.5,
        y: 137.5
    },
    D3: {
        x: 62.5,
        y: 137.5
    },
    EF: {
        x: 37.5,
        y: 100
    },
};

var chip_diameter = 3.9; // cm
var origin = {
    x: 37.5,
    y: 25 - (chip_diameter / 2)
};

var spring_constant = (0.457 * 9.81) / (0.0174625); // N/m
var coeff_kinetic_fric = 0.4667;
var coeff_resititution = 0.8;
var chip_mass = 0.0115; // kg
var ef_chip_mass = 0.015;

class Convertions {
    cmToM(cm) {
        return cm / 100;
    }

    mToMM(m) {
        return m * 1000;
    }

    gToKg(g) {
        return g / 1000;
    }

    kgToG(kg) {
        return kg * 1000;
    }
};
const Converter = new Convertions();

class Computations {
    deflectionToLoc(loc) {
        var dist = Converter.cmToM(this.distanceToLoc(loc));
        if(loc != "EF"){
            /* Conservation of Energy */
            var deflection = Math.sqrt( (coeff_kinetic_fric * chip_mass * 9.81 * dist) / (0.5 * spring_constant) );
            return Converter.mToMM(deflection);
        }else{
            /* Conservation of Energy and Conservation of Momentum */
            var ef_move_dist = Converter.cmToM(this.distance(locs.EF, {x: 37.5, y: 140}));
    
            var v_ef_final = Math.sqrt( (coeff_kinetic_fric * chip_mass * 9.81 * ef_move_dist) / (0.5 * chip_mass) );
    
            var v_chip_initial = (chip_mass * v_ef_final + ef_chip_mass * v_ef_final) / (chip_mass + chip_mass * coeff_resititution);
    
            var v_chip_launch = Math.sqrt( (0.5 * chip_mass * Math.pow(v_chip_initial, 2) + coeff_kinetic_fric * chip_mass * 9.81 * dist) / (0.5 * chip_mass) );
    
            var deflection = Math.sqrt( (0.5 * chip_mass * Math.pow(v_chip_launch, 2)) / (0.5 * spring_constant) );
    
            return Converter.mToMM(deflection);
        }
    }
    
    distance(p1, p2) {
        return Math.hypot(p2.x - p1.x, p2.y - p1.y);
    }
    
    distanceToLoc(loc) {
        var loc = locs[loc.toUpperCase()];
        return this.distance(origin, loc);
    }
    
    angleToLoc(loc) {
        var loc = locs[loc.toUpperCase()];
        // arctan(delta y / delta x)
        return 90 - Math.atan(Math.abs((loc.y - origin.y) / (loc.x - origin.x))) * 180 / Math.PI;
    }
};
const Calculations = new Computations();