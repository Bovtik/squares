const randomColor = function randomColor() {
  return '#' + Math.floor(Math.random() * (2<<23)).toString(16);
} 

const distance = function distance (v1, v2) {
  return Math.pow(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2), .5);
}

class Square {
  constructor(props) {
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.defaultSize = props.size || 1;
    this.size = this.defaultSize;
    this.color = props.color || "#ffffff";
    this.alpha = props.alpha || 1;

    if (props.animation) {
      this.animation = props.animation;
      this.animCounter = props.animation.progress * props.animation.duration || 0;
    }
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
const fieldSize = 512;

let scaleRatio = canvasSize / fieldSize;

const canvas = document.getElementById('canvas');
// canvas.width = window.innerWidth;
canvas.width = canvasSize;
canvas.height = canvasSize;
const ctx = canvas.getContext('2d');
ctx.setTransform(scaleRatio, 0, 0, scaleRatio, 0, 0);

const squareAmount = 96;
const gridSize = fieldSize / squareAmount;

var squares = [];
var anims = {
  randomColor: {
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
  },
};
for (let i = 0; i < squareAmount*squareAmount; i++) {
  squares.push(new Square({
    x: gridSize * (i % squareAmount + .5),
    y: gridSize * (Math.floor(i / squareAmount) + .5),
    size: gridSize,
    // color: "#ffffff",
    color: randomColor(),
    alpha: .2,
    animation: anims.randomColor
  }));
}

const draw = function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  squares.forEach( item => item.draw(ctx) );
}

setInterval(() => {
  window.requestAnimationFrame(draw);
}, 1000 / 60);

const mouse = {
  x: 0,
  y: 0,
  radius: 80
};
canvas.addEventListener('mousemove', (e) => {
  // console.log(e);
  
  // console.log(e.layerX / scaleRatio, e.layerY / scaleRatio);
  mouse.x = Math.round(e.layerX / scaleRatio);
  mouse.y = Math.round(e.layerY / scaleRatio);
  squares.forEach( (item) => {
    // console.log(distance(mouse, item));
    
    if (distance(mouse, item) < mouse.radius) {
      // let ratio = 1 - .27 * (2 + Math.cos((26 * distance(mouse, item) / mouse.radius)));
      let ratio = 1 - Math.pow(distance(mouse, item) / mouse.radius, 2);
      item.alpha = .2 + ratio * .8;
      item.size = item.defaultSize;
      item.size *= ratio + .2;
      // if (item.x )
    } else {
      item.size = item.defaultSize;
      item.alpha = 0;

      // if (e.buttons) {
        item.animate(60);
      // }
    }
  });
  // console.log(mouse)
  // if (distance(mouse, ))
});