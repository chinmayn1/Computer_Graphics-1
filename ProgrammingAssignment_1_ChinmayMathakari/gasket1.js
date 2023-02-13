"use strict";
var gl;
var points;
var sizeL;
var sizeF = 1;
var r, red, b, blue, g, green;
var TRUE = 1;
var NumberPoints = 5000;
var NumPoints=6000;

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
window.onload = function init()
{
    //get canvas by id
    var canvas = document.getElementById( "gl-canvas" );
// init gl variable to webgl
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    //
    //  Initialize our data for the Sierpinski Gasket
    //
    // First, initialize the corners of our gasket with three points.
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];
	
    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices

    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex
	

	for ( var i = 0; points.length < NumPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
	    points.push( p );}
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, Vertex, Fragment );
    gl.useProgram( program );
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	sizeL = gl.getUniformLocation(program, "size");
    r = gl.getUniformLocation(program, 'r');
    b = gl.getUniformLocation(program, 'b');
    g = gl.getUniformLocation(program, 'g');
    render();	
};

// function to change background color
function change_color(red, green, blue){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.clearColor(red, green, blue, 1.0);
}
//function to reset color to white
function reset_color(){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
}
// function for speed increase functionality
function zoom(){
    NumPoints = NumPoints+10
    sizeF +=0.1;
}
//function for slow speed functionality
function out(){
    NumPoints = NumPoints+10
    sizeF -=0.01;
}
//Render function we are calling this function on window init
function render() {
	red = (Math.random());
    green = (Math.random());
    blue = (Math.random());
    gl.clear( gl.COLOR_BUFFER_BIT );
    if(TRUE == 1)
    {
        if(sizeF<=0)
        TRUE=0; 
        sizeF -=0.1;
        NumPoints += 500;
    }
    else{
        if(sizeF>=1){
        TRUE=1;
        }
        sizeF +=0.1; 
        NumPoints -= 500;
    }	  
    gl.uniform1f(sizeL, sizeF);
    gl.uniform1f(r, red);
    gl.uniform1f(b, blue);
    gl.uniform1f(g, green);
    gl.drawArrays( gl.TRIANGLE, 0, points.length * sizeF);
    setTimeout(function() { requestAnimFrame(render);},150); 
    document.getElementById("cc").addEventListener("click", function() {     
        change_color(red, green, blue);
      });
      document.getElementById("reset").addEventListener("click", function() {     
        reset_color();
      });
      document.getElementById("zoom").addEventListener("click", function() {     
        zoom();
      });
      document.getElementById("out").addEventListener("click", function() {     
        out();
      });
};

