class Square {
  constructor(props) {
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.size = props.size || 1;
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
      this.animCounter += fps;  
    }

    this.alpha = this.animation.start.alpha + progress * (this.animation.end.alpha - this.animation.start.alpha);

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
// const viewSize = fieldSize;

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
    color: "#ffffff",
    alpha: .5,
    animation: {
      progress: Math.random().toFixed(4),
      duration: 2000,
      start: {
        alpha: 0,
        scale: 0.5
      },
      end: {
        alpha: 1,
        scale: 1.2
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