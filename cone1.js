class Cone {
    constructor(startId, radius, height, NumPoints, color){
        this.startId = startId;
        this.count = 0;

        this.radius = radius;
        this.height = height;
        this.NumPoints = NumPoints;
        this.color=color;

        this.R = rotate(30, [1, 0, 1]);
        this.S = scalem(0.3, 0.3, 1.0);
        this.T = translate(-0.8, 0.3, 0.0);

        this.calculateCone();
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
      console.log(color);
    }

    calculateCone(){
        let radius=this.radius;
        let NumPoints=this.NumPoints;
        let height=this.height;
          var NumTriangles=0;
          var step, alpha;
          var x, y, z, x1, z1;
    NumTriangles=NumPoints/3;
  for (var i = 0; i <=NumPoints-1; i++) {
    step=Math.PI*i/NumTriangles;
    alpha=step*(i+1)/i;
    x=radius*Math.cos(step);
    y=height; 
    z=radius*Math.sin(step);

    x1=radius*Math.cos(alpha);
    y=height;
    z1=radius*Math.sin(alpha);

    vertices.push(vec4(x,y,z,1));
    vertices.push(vec4(0,0,0,1));
    vertices.push(vec4(x1,y,z1,1));
 
    vertices.push(vec4(x,y,z,1));
    vertices.push(vec4(0,y,0,1));
    vertices.push(vec4(x1,y,z1,1));

    colors.push(vec4(1,0,0,1));
    colors.push(vec4(0,1,0,1));
    colors.push(vec4(0,0,1,1));
    
    colors.push(vec4(1,1,0,1));
    colors.push(vec4(1,1,0,1));
    colors.push(vec4(1,0,0,1));
    
    this.count += 6;
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