var canvas,ctx;
var interval;

var cx,cy;
var img = new Image();
var mask = new Image();
var complete = 0;

function init(){
  canvas = document.getElementById("gamecanvas");
  ctx = canvas.getContext("2d");
  
  img.src = "pp0.jpg";
  mask.src = "mask2.png";
  
  img.addEventListener("load",function(e){
    canvas.width = img.width;
    canvas.height = img.height;
  });
  
  
  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    cx = e.clientX-rect.left;
    cy = e.clientY-rect.top;
  }, false);
  
  start();
}


function start(){
  interval = setInterval(process, 25);
}

function keyPressed(e){
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyReleased(e){
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function process(){
  draw();
}

function draw(){
  //drawString("aaaa","#777",50,50,20);
  
  ctx.save();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(mask, cx-mask.width/2, cy-mask.height/2);
  
  ctx.restore();
}

function drawString(str, fillStyle, x, y, size){
  ctx.font = size + 'pt sans-serif';
  ctx.fillStyle = fillStyle;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(str, x, y);
}