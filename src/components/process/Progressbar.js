var Progressbar = function(options) {
  this.id = options.id;
  this.value = options.value || 0;
  this.width = options.width || 200;
  this.height = options.height || 200;
  this.bgColor = options.bgColor || 'green';
  this.barColor = options.barColor || 'red';
  this.fontColor = options.fontColor || '#000';
  if(options.init){
    this.init();
  }
}

Progressbar.prototype.init = function(){
  var canvas = document.getElementById(this.id);

  if(!canvas.getContext) {
    throw new Error('your browser does not support canvas')
  }

  if(!this.id){
    throw new Error('your need pass id ')
  }

  var width = parseInt(this.width);
  var height = parseInt(this.height);
  canvas.setAttribute('width',width);
  canvas.setAttribute('height',height);

  var ctx = canvas.getContext("2d");

  var startAngle = 3 / 2 * Math.PI;
  var percentage = 0;
  var diffAngle = 0;
  var cx = width / 2;
  var cy = height / 2;
  var timer = setInterval(draw, 50);
  var value = this.value;
  var bgColor = this.bgColor;
  var barColor = this.barColor;
  var fontColor = this.fontColor;

  function draw(){
    diffAngle = (percentage / 100) * Math.PI * 2;

    //清除矩形区域
    ctx.clearRect(0, 0, width, height);

    ctx.beginPath();

    //设置线段宽度
    ctx.lineWidth = 15;

    //绘制圆
    ctx.arc(cx, cy, 50, 0, 2 * Math.PI, false);

    //设置填充色
    ctx.fillStyle = '#FFF';
    ctx.fill();

    //绘制图形轮廓
    ctx.strokeStyle = bgColor; 
    ctx.stroke();

    //绘制百分比进度
    ctx.beginPath();
    ctx.arc(cx, cy, 50, startAngle, diffAngle + startAngle, false);
    ctx.strokeStyle = barColor;
    ctx.stroke();

    //绘制百分比文字
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.font = '16px serif';
    ctx.fillText(percentage + '%', cx, cy + 6);

    if (percentage >= value) {
      clearTimeout(timer);
    }

    percentage++;
  }
}

export default Progressbar;