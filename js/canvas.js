// Get optimal pixel ratio for current device
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

// Values to hold opacity of the line
var opacity = 1;
var opacityTask;

// Create a canvas with optimal pixel ratios
createHiDPICanvas = function (w, h, ratio) {
    if (!ratio) {
        ratio = PIXEL_RATIO;
    }
    var can = document.getElementById("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

// Create canvas with the device resolution.
var canvas = createHiDPICanvas($("#canvas").width(), $("#canvas").height());

// Get the canvas context
var ctx = canvas.getContext("2d");

// Set the canvas styles
ctx.translate(0.5, 0.5);
ctx.lineCap = "round";
ctx.fillStyle = "#000";
ctx.strokeStyle = "#000";

// An array to hold canvas locations
// These correspond to the actual locations
var canvasLocs = {
    origin: {
        x: 166,
        y: 582
    },
    A1: {
        x: 58,
        y: 415
    },
    A2: {
        x: 167.5,
        y: 415
    },
    A3: {
        x: 278,
        y: 415
    },
    B1: {
        x: 56,
        y: 305
    },
    B2: {
        x: 167.5,
        y: 305
    },
    B3: {
        x: 278,
        y: 305
    },
    C1: {
        x: 56,
        y: 195
    },
    C2: {
        x: 167.5,
        y: 195
    },
    C3: {
        x: 278,
        y: 195
    },
    D1: {
        x: 56,
        y: 86
    },
    D2: {
        x: 167.5,
        y: 86
    },
    D3: {
        x: 278,
        y: 86
    },
    EF: {
        x: 167.5,
        y: 245
    },
};

/**
 * Draw a line to a location
 * 
 * @param {Object} loc The location object
 */
function drawToLoc(loc) {
    if(opacityTask){
        clearInterval(opacityTask);
    }
    opacity = 1;
    $("#canvas").css({opacity: opacity});
    
    drawAnimatedLine(canvasLocs.origin, canvasLocs[loc]);
    
    opacityTask = setInterval(function(){
        opacity -= 0.01;
        if(opacity <= 0){
            clearInterval(opacityTask);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        $("#canvas").css({opacity: opacity});
    }, 60);
}

/**
 * Draw a line that gradually extends to a destination
 * 
 * @param {Object} from The origin coordinates
 * @param {Objeect} to The destination coordinates
 */
function drawAnimatedLine(from, to) {
    var b = jQuery.extend(true, {}, from);
    var dx = (to.x - b.x);
    var dy = (to.y - b.y);
    var mag = Math.sqrt(dx * dx + dy * dy);
    var vx = (dx / mag) * 8;
    var vy = (dy / mag) * 8;
    
    var task = setInterval(function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(canvasLocs.origin.x, canvasLocs.origin.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        
        b.x += vx;
        b.y += vy;
        vx *= 1.03;
        vy *= 1.03;

        drawLineWithArrow(from, b);
        
        if(Calculations.distance(b, to) < 35) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.arc(canvasLocs.origin.x, canvasLocs.origin.y, 10, 0, 2 * Math.PI);
            ctx.fill();
            
            drawLineWithArrow(from, to);
            clearInterval(task);
        }
    }, 10);
}

/**
 * Draw a line with an arrow head
 * 
 * @param {Object} from The origin coordinates
 * @param {Objeect} to The destination coordinates
 */
function drawLineWithArrow(from, to) {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = 5;
    ctx.stroke();
    drawArrowhead(ctx, from, to, 10);
}

/**
 * Draw an arrow head
 * 
 * @param {Object} context The canvas context
 * @param {Object} from The origin coordinates
 * @param {Object} to The destination coordinates
 * @param {number} radius The head radius
 */
function drawArrowhead(context, from, to, radius) {
    var x_center = to.x;
    var y_center = to.y;

    var angle;
    var x;
    var y;

    context.beginPath();

    angle = Math.atan2(to.y - from.y, to.x - from.x)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.moveTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    angle += (1.0 / 3.0) * (2 * Math.PI)
    x = radius * Math.cos(angle) + x_center;
    y = radius * Math.sin(angle) + y_center;

    context.lineTo(x, y);

    context.closePath();

    context.fill();
}