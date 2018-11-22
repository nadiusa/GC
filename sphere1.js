class Sphere {
    constructor(startId, radius, step,color){
        this.startId = 0;
        this.count = 0;
    
        this.radius = radius;
        this.step = step;
        this.color=color;
        this.R = rotate(0, [0, 1, 0]);
        this.S = scalem(0.5, 0.5, 1.0);
        this.T = translate(0.0, 0.0, 0.0);;

        this.calculateSphere();
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

    calculateSphere(){
        let step=this.step;
        let radius=this.radius;

    function X(phi, alpha){
    var rad=Math.PI/180;
     return radius*Math.sin(phi*rad)*Math.cos(alpha*rad);
    }
    function Y(phi, alpha){
    var rad=Math.PI/180;
     return radius*Math.sin(phi*rad)*Math.sin(alpha*rad);
    }
    function Z(phi){
    var rad=Math.PI/180;
     return radius*Math.cos(phi*rad);
    } 
       for (var phi = 0; phi<180;phi+=step){
         for (var alpha = 0; alpha< 360;alpha+=step){
           var phiNext=phi+step;
           var alphaNext=alpha+step;

           vertices.push(vec4(X(phi,alpha),Y(phi, alpha),Z(phi),1));
           vertices.push(vec4(X(phiNext,alpha),Y(phiNext, alpha),Z(phiNext),1));
           vertices.push(vec4(X(phi,alphaNext),Y(phi, alphaNext),Z(phi),1));
    
           vertices.push(vec4(X(phiNext,alpha),Y(phiNext, alpha),Z(phiNext),1));
           vertices.push(vec4(X(phi,alphaNext),Y(phi, alphaNext),Z(phi),1));
           vertices.push(vec4(X(phiNext,alphaNext),Y(phiNext, alphaNext),Z(phiNext),1));
   

           colors.push(vec4(0,1,0,1));
           colors.push(vec4(0,1,0,1));
           colors.push(vec4(0,1,0,1));



           colors.push(vec4(0,0,1,1));
           colors.push(vec4(0,0,1,1));
           colors.push(vec4(0,0,1,1));

                this.count += 6;
            }
        }
    }

    draw(){
        gl.uniformMatrix4fv(RLoc, false, flatten(this.R));
        gl.uniformMatrix4fv(SLoc, false, flatten(this.S));
        gl.uniformMatrix4fv(TLoc, false, flatten(this.T));
        gl.drawArrays(gl.LINES, this.startId, this.count); 
    } 
}