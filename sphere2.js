"use strict";

var gl;
var r=0.7;
var NumPoints=360;
var NumTriangles;
var x=0, y=0, z=0;
var x1=0, y1=0, z1=0;
var x2=0, y2=0, z2=0;
var step=0, stepNext=0, stepBack=0;
var alpha=0,alphaNext=0, alphaBack=0;
var h=-0.5;

var theta = [ 0 , 0, 0 ];
var axis = 0;
var xAxis = 0, yAxis = 1, zAxis = 2;
var thetaLoc =0 ;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices =[];
    var colors = [];
   // NumTriangles=NumPoints/3;
   for (var j = 0; j<(NumPoints/2);j++){
    for (var i = 0; i<= NumPoints-1;i++){
    step=convertToRadianA(j);
    stepNext=convertToRadianA(j+1);
    alpha=convertToRadianA(i);
    alphaNext=convertToRadianA(i+1);

    x=r*Math.sin(step)*Math.cos(alpha);
    y=r*Math.sin(step)*Math.sin(alpha);
    z=r*Math.cos(step);

    x1=r*Math.sin(stepNext)*Math.cos(alphaNext);
    y1=r*Math.sin(stepNext)*Math.sin(alphaNext);
    z1=r*Math.cos(stepNext);

    vertices.push(vec4(x,y,z,1));
    vertices.push(vec4(x1,y,z1,1));
    vertices.push(vec4(x,y1,z,1));
    

   vertices.push(vec4(x,y1,z,1));
   vertices.push(vec4(x1,y,z1,1));
   vertices.push(vec4(x1,y1,z1,1));
   

    colors.push(vec4(0,1,0,1));
    colors.push(vec4(0,1,0,1));
    colors.push(vec4(0,1,0,1));

    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
   }
}
console.log(vertices);
console.log(colors);
 
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
     gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    
    var verticesId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, verticesId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );


    var colorsId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, colorsId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );


    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    thetaLoc= gl.getUniformLocation(program, "theta");
    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };

    render();
};

function convertToRadianA( grade){
 var rad= grade*Math.PI/180;
 return rad;
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    theta[axis]+=0.5;
    gl.uniform3fv(thetaLoc, theta);
    gl.drawArrays( gl.TRIANGLES, 0, 1080*NumPoints);
    window.requestAnimFrame(render);
}