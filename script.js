var canvas,ctx;
var erasertmp;
var interval;

var cx,cy;
var scale = 1;
var mode;
var modeList = ["heart","star","eraser","top2mouse","bottom2mouse","left2mouse","right2mouse"];
const HEART = 0;
const STAR = 1;
const ERASER = 2;
const TOP2MOUSE = 3;
const BOTTOM2MOUSE = 4;
const LEFT2MOUSE = 5;
const RIGHT2MOUSE = 6;

var img = new Image();
var heartImg = new Image();
var starImg = new Image();
var circleImg = new Image();

var maskScale = 0.5;
var dragging = false;


function resizeCanvas(){
  var innerHeight = window.innerHeight;
  var innerWidth = window.innerWidth;
  
  imageAspectRatio = img.height/img.width;
  innerAspectRatio = innerHeight/innerWidth;
  
  if(imageAspectRatio > innerAspectRatio){
    //高さに合わせる
    canvas.height = innerHeight;
    canvas.width = innerHeight/imageAspectRatio;
  }else{
    //幅に合わせる
    canvas.width = innerWidth;
    canvas.height = innerWidth*imageAspectRatio;
  }
  scale = canvas.width/img.width;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  
  //戻し
  ctx.drawImage(erasertmp, 0, 0, img.width, img.height);
}

function onLoadImg(){
  //innerHeightとinnerWidthを使うので、
  //先に設定メニューを閉じる
  var settingOverlay = document.getElementById("settingOverlay");
  settingOverlay.style.display = "none";
  
  resizeCanvas();
  drawForegroundImage();
}

function updateCursorPoint(e){
  var rect = canvas.getBoundingClientRect();
  cx = (e.clientX - rect.left)/scale;
  cy = (e.clientY - rect.top)/scale;
}

function init(){
  var start = "pointerdown";
  var move  = "pointermove";
  var end   = "pointerup";
  
  canvas = document.getElementById("maincanvas");
  ctx = canvas.getContext("2d");
  erasertmp = document.getElementById("erasertmp");
  
  //マウスの座標更新
  canvas.addEventListener(start, function(e) {
    updateCursorPoint(e);
    dragging = true;
  }, false);
  canvas.addEventListener(move, function(e) {
    updateCursorPoint(e);
  }, false);
  canvas.addEventListener(end, function(e) {
    updateCursorPoint(e);
    dragging = false;
  }, false);
  
  window.addEventListener('touchmove', function(e) {e.preventDefault();},{passive: false});
  
  img.src = "p0.png";
  heartImg.src = "mask2.png";
  starImg.src = "mask1.png";
  circleImg.src = "mask3.png";
  
  mode = 0;
  
  window.addEventListener("resize", function(){
    resizeCanvas();
  },false);
  
  //全面画像の幅と高さをキャンバスに適用
  img.addEventListener("load",function(e){
    onLoadImg();
  });
  
  //モード更新（前回のが残るため）
  updateMode();
  //準備終わり、ループのスタート
  interval = setInterval(process, 25);
}

function fileChoosed(number){
  var form = document.getElementById("setting");
  var filePath;
  if(number==0){
    filePath = window.URL.createObjectURL(form.file0.files[0]);
    form.path_img0.value = filePath;
  }else{
    filePath = window.URL.createObjectURL(form.file1.files[0]);
    form.path_img1.value = filePath;
  }
}

function updatePath(){
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
  canvas.style.backgroundSize = "contain";
}

function updateMode(){
  var form = document.getElementById("setting");
  //表示モードの切り替え
  var modeStr = form.mode.value;
  mode = modeList.indexOf(modeStr);
  if(mode == ERASER){
    drawForegroundImage();
  }
}

function toggleOverlay() {
  var settingOverlay = document.getElementById("settingOverlay");
  var display = settingOverlay.style.display;
  if(display != "none"){
    settingOverlay.style.display = "none";
  }else{
    settingOverlay.style.display = "block";
  }
}

function eraserReset(){
  //上書きしてすぐに退避
  drawForegroundImage();
  evacuateCanvasImage();
}

function process(){
  //描画
  draw();
  
}

function drawForegroundImage(){
  ctx.drawImage(img, 0, 0, img.width, img.height);
}

function draw(){
  //描画状態の保存と全面画像の描画
  ctx.save();
  if(mode != ERASER){
    drawForegroundImage();
  }
  
  //マスクのモード（丸投げ）
  switch(mode){
    case HEART:
      maskHollow(heartImg);
      break;
    case STAR:
      maskHollow(starImg);
      break;
    case ERASER:
      if(dragging){
        maskDraw(66);
      }
      break;
    case TOP2MOUSE:
      maskTop2mouse();
      break;
    case BOTTOM2MOUSE:
      maskBottom2mouse();
      break;
    case LEFT2MOUSE:
      maskLeft2mouse();
      break;
    case RIGHT2MOUSE:
      maskRight2mouse();
      break;
  }
  
  //描画状態の復元
  ctx.restore();
}

function maskHollow(maskImg){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(maskImg, cx-maskImg.width/2/scale*maskScale, cy-maskImg.height/2/scale*maskScale, maskImg.width/scale*maskScale, maskImg.height/scale*maskScale);
}

function maskDraw(penSize){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'red'
  ctx.beginPath();
  ctx.arc(cx, cy, penSize/2, 0, Math.PI*2, false);
  ctx.fill();
  //退避
  evacuateCanvasImage();
}

function evacuateCanvasImage(){
  //描画中の画像の退避
  erasertmp.src = canvas.toDataURL();
}

function maskTop2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(0, 0, img.width, cy);
}

function maskBottom2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(0, cy, img.width, img.height);
}

function maskLeft2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(0, 0, cx, img.height);
}

function maskRight2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(cx, 0, img.width, img.height);
}
