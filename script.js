var canvas,ctx;
var interval;

var cx,cy;
var mode;
var modeList = ["heart","top2mouse","bottom2mouse","left2mouse","right2mouse"];
const HEART = 0;
const TOP2MOUSE = 1;
const BOTTOM2MOUSE = 2;
const LEFT2MOUSE = 3;
const RIGHT2MOUSE = 4;

var img = new Image();
var heartImg = new Image();

function init(){
  canvas = document.getElementById("gamecanvas");
  ctx = canvas.getContext("2d");
  
  img.src = "p0.png";
  heartImg.src = "mask2.png";
  
  mode = 0;
  
  //全面画像の幅と高さをキャンバスに適用
  img.addEventListener("load",function(e){
    canvas.width = img.width;
    canvas.height = img.height;
  });
  
  //マウスの座標更新
  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    cx = e.clientX-rect.left;
    cy = e.clientY-rect.top;
  }, false);
  
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
  //console.log("updatePath");
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

function updateMode(){
  var form = document.getElementById("setting");
  //表示モードの切り替え
  var modeStr = form.mode.value;
  mode = modeList.indexOf(modeStr);
}


function process(){
  draw();
  
  //log();
}

function log(){
  console.log(img.src);
}

function draw(){
  //描画状態の保存と全面画像の描画
  ctx.save();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  //マスクのモード（丸投げ）
  switch(mode){
    case HEART:
      maskHeart();
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

function maskHeart(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(heartImg, cx-heartImg.width/2, cy-heartImg.height/2);
}

function maskTop2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(0, 0, canvas.width, cy);
}

function maskBottom2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(0, cy, canvas.width, canvas.height);
}

function maskLeft2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(0, 0, cx, canvas.height);
}

function maskRight2mouse(){
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillRect(cx, 0, canvas.width, canvas.height);
}
