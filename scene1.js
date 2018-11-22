var gl;

var RLoc;
var SLoc;
var TLoc;
var sphere;
var cone;
var cylinder;
var objMenu ;
var objects={};
var keyOfLastCreateObject;

var numTimesToSubdivide = 3;
var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var va = vec4(0.0, 0.0, -1.0,1);
var vb = vec4(0.0, 0.942809, 0.333333, 1);
var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
var vd = vec4(0.816497, -0.471405, 0.333333,1);

var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

function colorsChange(){
    var selectedColor=colorsMenu.selectedIndex;
    var rgb;

    switch(selectedColor){
        case 0:
        rgb=vec4(1,0,0,1);
        break;
        case 1:
         rgb=vec4(0,1,0,1);
        break;
        case 2:
         rgb=vec4(0,0,1,1);
        break;
        case 3:
         rgb=vec4(1,1,0,1);
        break;
        case 4:
         rgb=vec4(0.1,0.8,0.9,1);
        break;
    } 
    var key=objMenu.options[objMenu.selectedIndex].value;
    objects[key].changeColor(rgb);
        }

function createNewObject(){
    var id= document.getElementById("elementId").value;
    var selectedType= document.getElementById("typeOfObject");
    var type=selectedType[selectedType.selectedIndex].value;
    switch (type){
        case "sphere": 
        objects[id]=new Sphere(objects[keyOfLastCreateObject].startId+objects[keyOfLastCreateObject].count, 0.5, 20, [Math.random(),Math.random(),Math.random(),1]);
        break;
        case "cone": 
        objects[id]=new Cone(objects[keyOfLastCreateObject].startId+objects[keyOfLastCreateObject].count, 0.5, 0.5, 300,[Math.random(),Math.random(),Math.random(),1]);
        break;
        case "Cylinder":    
        objects[id]=new Cylinder(objects[keyOfLastCreateObject].startId+objects[keyOfLastCreateObject].count, 0.5, 0.6, 300, [Math.random(),Math.random(),Math.random(),1]);
        break; 
    
    }
    var x = document.getElementById("objMenu");
    var option = document.createElement("option");
    option.text = id;
    x.add(option);
    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var colorsId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorsId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor); 


    objects[id].draw();
    keyOfLastCreateObject=id
    
} 

window.onload = function init(){
    var canvas = document.getElementById("canvas_id");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){
        console.log('WebGL not supported, falling back on experimental-webgl');
        gl = canvas.getContext('webgl');
    }
    if(!gl){
        alert('Your browser does not support WebGL');
    }
    
    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.08, 0.98, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

     program = initShaders(gl, 'vertex-shader', 'fragment-shader');
    gl.useProgram(program);


    // Prepare objects 
    objects["sphere"]=new Sphere(0, 0.8, 20,[1,0,0,1]);
    objects["cone"]=new Cone(objects["sphere"].startId+objects["sphere"].count, 0.5, 0.5, 300, [0,1,0,1]);
   objects["Cylinder"]=new Cylinder(objects["cone"].startId+objects["cone"].count, 0.5, 0.6,300, [0,0,1,1]);
   keyOfLastCreateObject="Cylinder"; 


    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    //Load data into GPU
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var verticesId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW); 

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // var colorsId = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorsId);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // var vColor = gl.getAttribLocation(program, "vColor");
    // gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vColor);

    RLoc = gl.getUniformLocation(program, "R");
    SLoc = gl.getUniformLocation(program, "S");
    TLoc = gl.getUniformLocation(program, "T");

    //menu
    var TLR = document.getElementById("TX");
    var TUD = document.getElementById("TY");
    var TFB = document.getElementById("TZ");

    var SX = document.getElementById("SX");
    var SY = document.getElementById("SY");
    var SZ = document.getElementById("SZ");

    var RX = document.getElementById("RX");
    var RY = document.getElementById("RY");
    var RZ = document.getElementById("RZ");
    var R = mat4();

 objMenu = document.getElementById("objMenu");
    var visibleChkB = document.getElementById("visibleChkB");
    var colorsMenu= document.getElementById("colorsMenu");


    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    document.getElementById("Button0").onclick = function(){radius *= 2.0;};
    document.getElementById("Button1").onclick = function(){radius *= 0.5;};
    document.getElementById("Button2").onclick = function(){theta += dr;};
    document.getElementById("Button3").onclick = function(){theta -= dr;};
    document.getElementById("Button4").onclick = function(){phi += dr;};
    document.getElementById("Button5").onclick = function(){phi -= dr;};
       document.getElementById("Button6").onclick = function(){
        numTimesToSubdivide++;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };
    document.getElementById("Button7").onclick = function(){
        if(numTimesToSubdivide) numTimesToSubdivide--;
        index = 0;
        pointsArray = [];
        normalsArray = [];
        init();
    };

    gl.uniform4fv( gl.getUniformLocation(program,"ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,"lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program, "shininess"),materialShininess );

  render();
};
      var render = function(){
         gl.clear(gl.COLOR_BUFFER_BIT);
         eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
         radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));

         modelViewMatrix = lookAt(eye, at , up);
         projectionMatrix = ortho(left, right, bottom, ytop, near, far);
         normalMatrix = [
         vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
         vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
         vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];


          gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
         gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
         gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

        if(+SX.value == 0) SX.value = "0.5";
        if(+SY.value == 0) SY.value = "0.5";
        if(+SZ.value == 0) SZ.value = "0.5";

        R = mult(rotateZ(+RZ.value), rotateY(+RY.value));
        R = mult(R, rotateX(+RX.value));

         var key =objMenu.options[objMenu.selectedIndex].value;
               objects[key].T = translate(+TX.value, +TY.value, +TZ.value);
                if(visibleChkB.checked == true){
                   objects[key].S = scalem(+SX.value, +SY.value, +SZ.value);
                } else {
                   objects[key].S = scalem(0.0, 0.0, 0.0);
                }
            objects[key].R = R; 

  for (var key in objects){
    objects[key].draw();
 }
   // for( var i=0; i<index; i+=3)
   //     gl.drawArrays( gl.TRIANGLES, i, 3 );

    window.requestAnimFrame(render);
};