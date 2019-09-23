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
  
  //�S�ʉ摜�̕��ƍ������L�����o�X�ɓK�p
  img.addEventListener("load",function(e){
    canvas.width = img.width;
    canvas.height = img.height;
  });
  
  //�}�E�X�̍��W�X�V
  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    cx = e.clientX-rect.left;
    cy = e.clientY-rect.top;
  }, false);
  
  //�����I���A���[�v�̃X�^�[�g
  interval = setInterval(process, 25);
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
  
  //�O�ʂ̍X�V
  img.src = foregroundPath;
  
  //�w�ʂ̍X�V
  canvas.style.background = "url(\'" + backgroundPath + "\')";
}

function updateMode(){
  var form = document.getElementById("setting");
  //�\�����[�h�̐؂�ւ�
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
  //�`���Ԃ̕ۑ��ƑS�ʉ摜�̕`��
  ctx.save();
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
  //�}�X�N�̃��[�h�i�ۓ����j
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
  
  //�`���Ԃ̕���
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
