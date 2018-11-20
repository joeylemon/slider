var touchmove;
$('#nav-slider, #nav-edit').on('touchend', function (e) {
    if (!touchmove) {
        var other = "nav-edit";
        if(this.id == "nav-edit") {
            other = "nav-slider";
        }
        $("#" + this.id + "-div").show();
        $("#" + other + "-div").hide();

        $(this).addClass("active");
        $("#" + other).removeClass("active");
    }
}).on('touchmove', function (e) {
    touchmove = true;
}).on('touchstart', function (e) {
    touchmove = false;
});

var saved_numbers = {
    spring_constant: spring_constant,
    coeff_kinetic_fric: coeff_kinetic_fric,
    coeff_resititution: coeff_resititution,
    chip_mass: chip_mass,
    ef_chip_mass: ef_chip_mass
};

$("#coeff").attr('placeholder', saved_numbers.coeff_kinetic_fric.toFixed(4));
$("#rest-coeff").attr('placeholder', saved_numbers.coeff_resititution.toFixed(4));
$("#constant").attr('placeholder', saved_numbers.spring_constant.toFixed(4));
$("#weight").attr('placeholder', Converter.kgToG(saved_numbers.chip_mass.toFixed(4)));
$("#ef-mass").attr('placeholder', Converter.kgToG(saved_numbers.ef_chip_mass.toFixed(4)));

$('#coeff').on('input', function() {
    try {
        var value = document.getElementById("coeff").value;
        if(value.length > 0) {
            coeff_kinetic_fric = parseFloat(value);
        }else{
            coeff_kinetic_fric = saved_numbers.coeff_kinetic_fric;
        }
    }catch(ex) {
        console.log("Not a number.");
    }
});

$('#rest-coeff').on('input', function() {
    try {
        var value = document.getElementById("rest-coeff").value;
        if(value.length > 0) {
            coeff_resititution = parseFloat(value);
        }else{
            coeff_resititution = saved_numbers.coeff_resititution;
        }
    }catch(ex) {
        console.log("Not a number.");
    }
});

$('#constant').on('input', function() {
    try {
        var value = document.getElementById("constant").value;
        if(value.length > 0) {
            spring_constant = parseFloat(value);
        }else{
            spring_constant = saved_numbers.spring_constant;
        }
    }catch(ex) {
        console.log("Not a number.");
    }
});

$('#weight').on('input', function() {
    try {
        var value = document.getElementById("weight").value;
        if(value.length > 0) {
            chip_mass = Converter.gToKg(parseFloat(value));
        }else{
            chip_mass = saved_numbers.chip_mass;
        }
    }catch(ex) {
        console.log("Not a number.");
    }
});

$('#ef-mass').on('input', function() {
    try {
        var value = document.getElementById("ef-mass").value;
        if(value.length > 0) {
            ef_chip_mass = Converter.gToKg(parseFloat(value));
        }else{
            ef_chip_mass = saved_numbers.ef_chip_mass;
        }
    }catch(ex) {
        console.log("Not a number.");
    }
});