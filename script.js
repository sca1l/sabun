var canvas,ctx;
var interval;

var cx,cy;
var img = new Image();
var mask = new Image();

function init(){
  canvas = document.getElementById("gamecanvas");
  ctx = canvas.getContext("2d");
  
  img.src = "pp0.png";
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

function updatePath(){
  console.log("updatePath");
  var form = document.getElementById("setting");
  
  var foregroundPath = form.path_img0.value;
  var backgroundPath = form.path_img1.value;
  
  var order = form.order.value;
  if(order == "reverse"){
    var tmp = foregroundPath;
    foregroundPath = backgroundPath;
    backgroundPath = tmp;
  }
  
  //前面の更新
  img.src = foregroundPath;
  
  //背面の更新
  canvas.style.background = "url(\'" + backgroundPath + "\')";
}

function start(){
  interval = setInterval(process, 25);
}

function process(){
  draw();
  
  log();
}

function log(){
  //console.log(img.src);
}

function draw(){
  ctx.save();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(mask, cx-mask.width/2, cy-mask.height/2);
  
  ctx.restore();
}
