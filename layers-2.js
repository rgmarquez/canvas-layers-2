/**
 * A simple example of using HTML5 canvases and zIndex to draw two
 * moving circles, one behind the HTML text, and on in front of the HTML text.
 *
 * @author Richard "Greg" Marquez (aka G-Money)
 * @license MIT
 * @description I wrote this code back in June 2, 2018; it uses old style JavaScrip conventions,
 *  including defining classes using functions and prototypes.  I use two canvases, one with a
 *  positive zIndex and one with a negative zIndex to draw two moving corcles, one behind the
 *  HTML text, and one in front of the HTML text.  The two circles move left to right and right
 *  to left to demonstrate the Z sorting with the text and each other.  Scrolling is supposed
 *  to keep the circles in the same position as the text is scrolled between them and the current
 *  implementation worked well in Safari, Firefox, and Chrome circa 2018.  However, the code
 *  now seems to have "stuttering" problems as you stroll up and down quickly in modern (2024)
 *  Safari, which I will debug soon.
 */

// - --------------------------------------------------------------------------
// - Layers
// - --------------------------------------------------------------------------
function Layers(arrayOfCanvases) {
  this.canvases = arrayOfCanvases;

  this.canvases[0].style.zIndex = "1";
  this.canvases[1].style.zIndex = "-1";

  this.context2DArray = [];
  this.xy = { x: 0, y: 0 };
}
Layers.prototype = {
  getCanvas: function (index) {
    if (index >= 0 && index < this.canvases.length) {
      return this.canvases[index];
    }
    return null;
  },
  get2dContext: function (index) {
    var context = this.context2DArray[index];
    if (!context) {
      var canvas = this.getCanvas(index);
      if (canvas) {
        context = canvas.getContext("2d");
      } else {
        context = null;
      }
      this.context2DArray[index] = context;
      console.log("new context : " + context);
    }
    return context;
  },
  getWidth: function (index) {
    var canvas = this.getCanvas(index);
    if (canvas) {
      return canvas.width;
    }
    return 0;
  },
  setWidthHeight: function (width, height) {
    for (let canvas of this.canvases) {
      canvas.width = width;
      canvas.height = height;
    }
  },
  setXY: function (x, y) {
    for (let canvas of this.canvases) {
      canvas.style.left = x + "px";
      canvas.style.top = y + "px";
    }
    this.xy = { x: x, y: y };
  },
  onScroll: function () {
    var coords = this.getScroll();
    this.setXY(coords.x, coords.y);
  },
  getScroll: function () {
    if (window.pageYOffset != undefined) {
      return { x: pageXOffset, y: pageYOffset };
    } else {
      var sx,
        sy,
        d = document,
        r = d.documentElement,
        b = d.body;
      sx = r.scrollLeft || b.scrollLeft || 0;
      sy = r.scrollTop || b.scrollTop || 0;
      return { x: sx, y: sy };
    }
  },
};

// - --------------------------------------------------------------------------
// - Circle
// - --------------------------------------------------------------------------
function Circle(position, delta, color) {
  this.oldPosition = { x: position.x, y: position.y }; // Object.assign(position);
  this.position = { x: position.x, y: position.y }; //Object.assign(position);
  this.delta = delta;
  this.color = color;
}
Circle.prototype = {
  draw: function (context2d) {
    var radius = 70;
    var lineWidth = 5;
    var widthHeight = 2 * radius + 2 * lineWidth;
    var halfWidth = widthHeight / 2;
    var halfheight = widthHeight / 2;

    context2d.clearRect(
      this.oldPosition.x,
      this.oldPosition.y,
      widthHeight,
      widthHeight
    );

    context2d.beginPath();
    context2d.arc(
      this.position.x + halfWidth,
      this.position.y + halfWidth,
      radius,
      0,
      2 * Math.PI,
      false
    );
    context2d.fillStyle = this.color;
    context2d.fill();
    context2d.lineWidth = lineWidth;
    context2d.strokeStyle = "#003300";
    context2d.stroke();

    this.oldPosition = { x: this.position.x, y: this.position.y }; //Object.assign(this.position);
  },
  tick: function () {
    this.position.x += this.delta;
    if (this.position.x > 500) {
      this.delta = -this.delta;
    } else if (this.position.x < 0) {
      this.delta = -this.delta;
    }
  },
};

// - --------------------------------------------------------------------------
// - Application
// - --------------------------------------------------------------------------
function Application(layers) {
  this.circle1 = new Circle({ x: 0, y: 0 }, 4, "blue");
  this.circle2 = new Circle({ x: 300, y: 100 }, -4, "yellow");
  this.layers = layers;
  this.onResize();
}

Application.prototype = {
  onResize: function () {
    console.log("onResize()");
    this.layers.setWidthHeight(window.innerWidth, window.innerHeight);
  },
  onScroll: function () {
    this.layers.onScroll();
  },
  onTick: function () {
    this.circle1.tick();
    this.circle1.draw(this.layers.get2dContext(0));
    this.circle2.tick();
    this.circle2.draw(this.layers.get2dContext(1));
  },
};

// - --------------------------------------------------------------------------
// - runtime
// - --------------------------------------------------------------------------

var layers = null;
var application = null;

function getElementsById(nameArray) {
  returnValue = [];
  for (var i = 0; i < nameArray.length; ++i) {
    returnValue.push(document.getElementById(nameArray[i]));
  }
  return returnValue;
}

window.onload = function () {
  layers = new Layers(getElementsById(["layer1", "layer2"]));

  application = new Application(layers);
  window.addEventListener("scroll", application.onScroll.bind(application));
  var fps = 60;
  var interval = setInterval(application.onTick.bind(application), 1000 / fps);
};
