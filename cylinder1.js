class Cylinder  {
    constructor(startId, radius, height, NumPoints , color){
        this.startId = startId;
        this.count = 0;

        this.NumPoints = NumPoints;
        this.radius = radius;
        this.height = height;
        this.color=color;
        this.R = rotate(20, [1, 1, 0]);
        this.S = scalem(0.3, 0.3, 1.0);
        this.T = translate(-0.5, -0.6, 0.0);

        this.calculateCylinder();
    }

changeColor(color){
    this.color=color;
      for (var i=this.startId; i< this.startId+this.count; i++){
          colors[i]=color;
      }
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
    }

    calculateCylinder(){
        let NumPoints=this.NumPoints;
       let radius=this.radius;
       let height= this.height;

         function X(phi){
            return radius*Math.cos(phi);
         }
        function Z(phi){
           return radius*Math.sin(phi);
        }
        function Xj(phi) {
          return radius*(90/100)*Math.cos(phi);
        }
        function Zj(phi) {
        return radius*(90/100)*Math.sin(phi);
  
        }

    function calculate_normal(p1, p2, p3) {
    var n1=vec4();
    var n2=vec4();
    var normal=vec4();
    n1= subtract(p2,p1);
    n2= subtract(p3,p1);
    normal=cross(n1,n2);
    normal[3]=0;
    console.log(normal);
    return normal;
}
   var NumTriangles=NumPoints/3;
   var alpha;
   var step;
   var y=0;
  for (var i = 0; i <=NumPoints-1; i+=3) {
    step=Math.PI*i/NumTriangles;
    alpha=step*(i+1)/i;
    y=height; 

   // baza de sus
    vertices.push(vec4(Xj(step),y,Zj(step),1));
    vertices.push(vec4(0,y,0,1));
    vertices.push(vec4(Xj(alpha),y,Zj(step),1));
    
   // baza de jos
    vertices.push(vec4(X(step),0,Z(step),1));
    vertices.push(vec4(0,0,0,1));
    vertices.push(vec4(X(alpha),0,Z(alpha),1));
   
    //injur
    vertices.push(vec4(Xj(step),0,Zj(alpha),1));
    vertices.push(vec4(Xj(step),y,Zj(step),1));
    vertices.push(vec4(Xj(alpha),0,Zj(alpha),1));

    vertices.push(vec4(Xj(alpha),0,Zj(alpha),1));
    vertices.push(vec4(Xj(step),y,Zj(step),1));
    vertices.push(vec4(Xj(alpha),y,Zj(alpha),1));

//Culors
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));


    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));


    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));


    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));
    colors.push(vec4(0,0,1,1));


    this.count +=12 ;
  }
  for (var i=0; i< NumPoints-1; i+=3){
    var this_normal=vec4();
    this_normal=calculate_normal(vertices[i], vertices[i+1], vertices[i+2]);
    normals[i]= this_normal;
    this_normal=calculate_normal(vertices[i], vertices[i+1], vertices[i+2]);
    normals[i+1]=this_normal;
    this_normal=calculate_normal(vertices[i], vertices[i+1], vertices[i+2]);
    normals[i+2]=this_normal;
  }
    }

    draw(){
        gl.uniformMatrix4fv(RLoc, false, flatten(this.R));
        gl.uniformMatrix4fv(SLoc, false, flatten(this.S));
        gl.uniformMatrix4fv(TLoc, false, flatten(this.T));
        //gl.drawArrays(gl.TRIANGLES, this.startId, this.count);
         gl.drawArrays(gl.LINES, this.startId, this.count);
    }
}