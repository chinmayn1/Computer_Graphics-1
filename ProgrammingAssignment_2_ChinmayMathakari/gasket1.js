"use strict";
var gl;
var points, canvas;
var sizeL;
var sizeF = 1;
var r , red, b, blue, g , green;
var TRUE = 1;
var NumPoints = 5000;
var speed = 150;
//Html Code in JS 
var Vertex = ['attribute vec4 vPosition;',
    'uniform float size;',
    'void main(){',
    'gl_PointSize = 1.0;',
    'gl_Position.x = size*vPosition.x;',
    'gl_Position.y = size*vPosition.y;',
    'gl_Position.z = 0.0;',
    'gl_Position.w = 1.0;',
    '}'];

var Fragment = ['precision mediump float;',
    'uniform float r;',
    'uniform float g;',
    'uniform float b;',
    'void main(){',
    'gl_FragColor = vec4( r, g, b, 1.0 );',
    '}'];


// initilize code on window onload
window.onload = function init() {
    //get canvas by id
    canvas = document.getElementById("gl-canvas");
    // init gl variable to webgl
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    getPoints(NumPoints);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, Vertex, Fragment);
    gl.useProgram(program);
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    sizeL = gl.getUniformLocation(program, "size");
    r = gl.getUniformLocation(program, 'r');
    b = gl.getUniformLocation(program, 'b');
    g = gl.getUniformLocation(program, 'g');
    render();
};

// Function to change animie speed
function updateSpeed(value) {
    speed = value;
    setTimeout(function () { requestAnimFrame(render); }, speed);
    document.getElementById("status").innerHTML = "Speed changed to : "+ speed;
}
//function to change number of points input is comming from HTML code.
function slider(NumberPoints) {
    points = getPoints(NumberPoints);
    getPoints(NumberPoints);
    document.getElementById("status").innerHTML = "Number of Points : "+ NumberPoints;    
};
// function to get number of points and calling it in render function
function getPoints(NumPoints) {
    var vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    var u = add(vertices[0], vertices[1]);
    var v = add(vertices[0], vertices[2]);
    var p = scale(0.25, add(u, v));
    points = [p];
    for (var i = 0; points.length < NumPoints; ++i) {
        var j = Math.floor(Math.random() * 3);
        p = add(points[i], vertices[j]);
        p = scale(0.5, p);
        points.push(p);
    }

    return points;
};

//Render function we are calling this function on window init
function render() {
    // call to get color function
    getColor();
    // set X position Y Position and View port 
    var x = document.getElementById("x").value;
    var y = document.getElementById("y").value;
    var aspect = document.getElementById("aspect").value;
    if(gl.viewport(x, y, aspect * canvas.width, aspect * canvas.height)){
        ddocument.getElementById("status").innerHTML = "position Changed!";
    }
    
    gl.clearColor(1.0, 1.0, 1.0, 1.0);


        if (TRUE == 1) {
            if (sizeF <= 0)
                TRUE = 0;
            sizeF -= 0.1;

        }
        else if (TRUE == 0) {
            if (sizeF >= 1) {
                TRUE = 1;
            }
            sizeF += 0.1;
        }
        else {
            sizeF == sizeF;
        }
    gl.uniform1f(sizeL, sizeF);
    gl.uniform1f(r, red);
    gl.uniform1f(b, blue);
    gl.uniform1f(g, green)
    gl.drawArrays(gl.TRIANGLE, 0, points.length * sizeF);
    setTimeout(function () { requestAnimFrame(render); }, speed);


    // All Event Listners 

    document.getElementById("play").addEventListener("click", function () {
        TRUE = 1;
    });

    document.getElementById("pause").addEventListener("click", function () {
        TRUE = 2;
    });
function getColor() {
    var cc = document.getElementById("colorpicker");
    cc.addEventListener("change", function () {
        var rgbhex = cc.value;
        gl.clear(gl.COLOR_BUFFER_BIT);
        red = parseInt(rgbhex.substr(1, 2), 16) / 255;
        green = parseInt(rgbhex.substr(3, 2), 16) / 255;
        blue = parseInt(rgbhex.substr(5, 2), 16) / 255;
        redtxt.value = red;
        greentxt.value = green;
        bluetxt.value = blue;
        document.getElementById("status").innerHTML = "Color Changed!";
    }, false);
    var setButton = document.getElementById('setColor');
    setButton.addEventListener('click', function () {
        red = parseInt(redtxt.value)/255;
        green = parseInt(greentxt.value)/255;
        blue = parseInt(bluetxt.value)/255;
        document.getElementById("status").innerHTML = "Color Changed!";
    }, false);
};

}
