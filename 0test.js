"use strict";

var canvas;
var gl;
var points = [];
var theta = 45;
var num = 5;

window.onload = function init() {
  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  //
  //  Initialize our data for the Sierpinski Gasket
  //

  // First, initialize the corners of our gasket with three points.


  //
  //  Configure WebGL
  //
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

  //  Load shaders and initialize attribute buffers

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  // Load the data into the GPU

  var bufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
  gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 8), gl.STATIC_DRAW );



  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  document.getElementById("tes_slider").value = num;
  document.getElementById("tes_slider").onchange = function(event) {
    num = event.target.value;
    console.log(num);
    render();
  };

  document.getElementById("twist_slider").value = theta;
  document.getElementById("twist_slider").onchange = function(event) {
    theta = event.target.value;
    console.log(theta + " " + theta / 360 * Math.PI * 2);
    render();
  };


  render();
};

function triangle(a, b, c) {
  points.push(a, b, c);
}

function divideTriangle(a, b, c, num) {
  if (num === 0) {
    triangle(a, b, c);
  } else {
    var ab = midpoint2d(a, b, 0.5);
    var ac = midpoint2d(a, c, 0.5);
    var bc = midpoint2d(b, c, 0.5);
    --num;
    divideTriangle(a, ab, ac, num);
    divideTriangle(b, bc, ab, num);
    divideTriangle(c, ac, bc, num);
    divideTriangle(ab, ac, bc, num);
  }
}

function midpoint2d(a, b) {
  var result = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  return result;
}


function render() {
  var vertices = [
    [-0.5, -0.5],
    [0, 0.5],
    [0.5, -0.5]
  ];
  divideTriangle(vertices[0], vertices[1], vertices[2], num);

  points.forEach(function(entry) {
    var x = entry[0];
    var y = entry[1];
    var angle = theta * Math.sqrt(x * x + y * y);
    angle = angle / 360 * 2 * Math.PI;
    entry[0] = x * Math.cos(angle) - y * Math.sin(angle);
    entry[1] = x * Math.sin(angle) + y * Math.cos(angle);
  });

  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
  gl.clear( gl.COLOR_BUFFER_BIT );
  gl.drawArrays( gl.TRIANGLES, 0, points.length );
  points = [];
}
