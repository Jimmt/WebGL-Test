"use strict";

var gl;
var points;
var theta = 0, thetaLoc;
var colors = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // Four Vertices

    var vertices = [
      -0.5, -0.5,
      -0.5,  0.5,
      0.5, 0.5,
      0.5, -0.5
    ];

    colors = [1.0, 0.0, 0.0, 1.0,
    0.0, 0.0, 0.0, 1.0,
  0.0, 0.0, 1.0, 1.0,
0.0, 1.0, 0.0, 1.0];


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta" );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    theta += 0.1;
    for(var i = 0; i < colors.length; i++){
      colors[i] = Math.random();
    }
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(colors));
    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
    requestAnimFrame(render);
}
