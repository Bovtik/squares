const randomColor = function randomColor() {
  return '#' + Math.floor(Math.random() * (2<<23)).toString(16);
} 

class Square {
  constructor(props) {
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.defaultSize = props.size || 1;
    this.size = this.defaultSize;
    this.color = props.color || "#ffffff";
    this.alpha = props.alpha || 1;

    this.animation = props.animation;
    this.animCounter = props.animation.progress * props.animation.duration || 0;
  }
  animate(fps) {
    let progress = this.animCounter / this.animation.duration; 
    
    if (progress >= 1) {
      this.animCounter = 0;
    } else {
      this.animCounter += fps/2;  
    }
    if (progress > .5) {
      progress = 1 - progress; 
    }
    this.alpha = this.animation.start.alpha + 2*progress * (this.animation.end.alpha - this.animation.start.alpha);
    this.size = this.defaultSize;
    this.size *= this.animation.start.scale + 2*progress * (this.animation.end.scale - this.animation.start.scale);

    return this;
  }
  draw(ctx) {
    if (this.alpha < 16/255) this.alpha = 16/255;
    let hexColor = this.color + Math.round(this.alpha * 255).toString(16);
    ctx.fillStyle = hexColor;
    // ctx.strokeStyle = this.color;
    ctx.fillRect(this.x - this.size/2,
                 this.y - this.size/2,
                 this.size,
                 this.size);
  }
}



const canvasSize = window.innerHeight;
const fieldSize = 400;

let scaleRatio = canvasSize / fieldSize;

const canvas = document.getElementById('canvas');
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext('2d');
ctx.setTransform(scaleRatio, 0, 0, scaleRatio, 0, 0);

const gridSize = fieldSize / 20;
var squares = [];
for (let i = 0; i < 400; i++) {
  squares.push(new Square({
    x: gridSize * (i % 20 + .5),
    y: gridSize * (Math.floor(i / 20) + .5),
    size: gridSize/2,
    // color: "#ffffff",
    color: randomColor(),
    alpha: .5,
    animation: {
      progress: Math.random().toFixed(4),
      duration: 1000 + Math.floor(Math.random() * 1500),
      start: {
        alpha: 0.15,
        scale: 1
      },
      end: {
        alpha: 1,
        scale: 2
      }
    }
  }));
}

const draw = function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  squares.forEach( item => item.animate(60).draw(ctx) );
}

setInterval(() => {
  window.requestAnimationFrame(draw);
}, 1000 / 60);