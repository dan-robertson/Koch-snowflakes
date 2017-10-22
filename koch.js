var piby2 = Math.PI / 2

//returns an array of [height, width, 1-width,1+width]
//so that the lines (-1,0) -- (-width,0) and
//(-width, 0) -- (0, height) are of equal length and meet at an angle of pi-angle.
//angle should be in the range (0, pi/2]
function KochFactors(angle){
  console.assert(angle<=piby2);
  //must have tan(width/height) = angle
  //width*width + height*height = (1-width)*(1-width)
  //so width/cos(angle) = (1-width)
  var c = 1/Math.cos(angle);
  var width = 1/(c+1);
  var height = Math.sqrt(1-2*width);
  return [width, height, 1-width, 1+width];
}

function diff(a,b){//returns the vector b-a (i.e. the vector from a to b)
  return [b[0]-a[0],b[1]-a[1]];
}
function scale(l,a){//returns l*a
  return [a[0]*l, a[1]*l];
}
function addbit(a, l, b){ //returns a+l*b where a,b are 2vectors
  return [a[0]+l*b[0], a[1]+l*b[1]];
}
function perp(a){//returns a vector of the same length as a but perpendicular
//specifically returns the vector that goes left when walking from 0 to a.
  return [-a[1], a[0]];
}
function lensq(p){
  return p[0]*p[0] + p[1]*p[1];
}
function distsq(a,b){
  return lensq(diff(a,b));
}
function dist(a,b){
  return Math.sqrt(distsq(a,b));
}

//given points (i.e. like [x, y]) a, b find points a', b', c s.t.
//	a', b' lie on the line ab
//	aa'=b'b=a'c=cb' (in length)
//	the lines (aa', a'c) and (cb', b'b) meet at angles of pi-angle
//	where factors = KochFactors(angle)
//      and c is chosen such that it is on the left when walking from a to b
//returns [a', c, b']
function Kochify(factors, a, b){
  var w,h,w2,w3;
  w=factors[0];
  h=factors[1];
  w2=factors[2];//== 1-w
  w3=factors[3];//== 1+w
  var a2, b2, mp, p, c;
  var d = scale(0.5, diff(a,b));
  a2 = addbit(a,w2,d);
  b2 = addbit(a,w3,d);
  mp = addbit(a,1.0,d);
  p = perp(d);
  c = addbit(mp,h,p);
  return [a2, c, b2];
}

//let step2 be 4*step
//for each pair of points a,b =  vec[i*step2], vec[(i+1)*step2],
//  do Kochify(factors, a,b) and put these at i*step2+k*step for k=1,2,3
function addKochStep(factors, vec, step){
  var step2 = 4*step;
  for(var i=0,i2=step2; i2 < vec.length; i=i2, i2+= step2){
    var mid = Kochify(factors, vec[i], vec[i2]);
    vec[i+step] = mid[0];
    vec[i+2*step] = mid[1];
    vec[i+3*step] = mid[2];
  }
}

function KochCurve(angle, depth){
  var vec = new Array((1 << (depth*2)) + 1);
  vec[0] = [-1,0];
  vec[vec.length - 1] = [1,0];
  var factors=KochFactors(angle);
  for(var step = (vec.length - 1) / 4; step>=1; step = step >> 2){
    addKochStep(factors, vec, step);
  }
  return vec;
}

function drawKochCurve(c,vec){
  var w = c.canvas.width;
  var sf = w/2;
  c.moveTo(sf*(vec[0][0]+1), sf*(1.2-vec[0][1]));
  for(var i = 1; i < vec.length; i++){
    c.lineTo(sf*(vec[i][0]+1), sf*(1.2-vec[i][1]));
  }
  c.stroke();
}

function KochSnowflake(angle, depth){
  var step0 = (1 << (depth*2));
  var vec = new Array(step0*3+1);
  vec[0] = [-1,0];
  vec[step0] = [1,0];
  vec[step0*2] = [0,-Math.sqrt(3)];
  vec[step0*3] = [-1,0];
  var factors=KochFactors(angle);
  for(var step = step0 / 4; step>=1; step = step >> 2){
    addKochStep(factors, vec, step);
  }
  return vec;
}

function drawKochSnowflake(c,vec){
  var w = c.canvas.width;
  var sf = w/(1.2+Math.sqrt(3));
  c.moveTo(sf*(vec[0][0]+1.4), sf*(1-vec[0][1]));
  for(var i = 1; i < vec.length; i++){
    c.lineTo(sf*(vec[i][0]+1.4), sf*(1-vec[i][1]));
  }
  c.stroke();
}

var maxdepth=7;

function doKoch(t){
  var angle;
  angle = Math.abs(((t / 10000) % 2)-1) * piby2 // repeates every 10s
  var c = this;
  c.canvas.width = c.canvas.width;
  drawKochSnowflake(c,KochSnowflake(angle,5));
  c.fillText(angle/Math.PI,50,10);
  requestAnimationFrame(doKoch.bind(c));
}

function startKoch(){
  var can = document.getElementById("c");
  var c = can.getContext("2d");
  requestAnimationFrame(doKoch.bind(c));
}