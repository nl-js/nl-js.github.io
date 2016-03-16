var color1 = new Color('#F0DB4F');
var color2 = new Color('#29d9c2');
color2.alpha = 0.5;
var color3 = new Color('#01a2a6');
color3.alpha = 0.5;
var color4 = new Color('#272933');

var waves = [new Wave(color4, 0.07), new Wave(color3, 0.08), new Wave(color2, 0.09), new Wave(color1, 0.1)];

function Wave(fillColor, strength) {
  this.strength = strength;
  this.fillColor = fillColor;
  this.path; // = this.createPath(0.1);
  this.values = {
    friction: 0.8,
    timeStep: 0.01,
    amount: 15,
    mass: 4,
    count: 0
  };
  this.values.invMass = 1 / this.values.mass;
  this.springs = [];
  this.size = view.size * [1.2, 1];
}

Wave.prototype.updateWave = function () {
  var force = 1 - this.values.friction * this.values.timeStep * this.values.timeStep;
  for (var i = 0, l = this.path.segments.length; i < l; i++) {
    var point = this.path.segments[i].point;
    var dy = (point.y - point.py) * force;
    point.py = point.y;
    point.y = Math.max(point.y + dy, 0);
  }

  for (var j = 0, l = this.springs.length; j < l; j++) {
    this.springs[j].update();
  }
  this.path.smooth({
    type: 'continuous'
  });
}

Wave.prototype.createPath = function () {
  this.path = new Path({
    fillColor: this.fillColor
  });
  this.springs = [];
  for (var i = 0; i <= this.values.amount; i++) {
    var segment = this.path.add(new Point(i / this.values.amount, 0.5) * this.size);
    var point = segment.point;
    if (i == 0 || i == this.values.amount)
      point.y += this.size.height;
    point.px = point.x;
    point.py = point.y;
    // The first two and last two points are fixed:
    point.fixed = i < 2 || i > this.values.amount - 2;
    if (i > 0) {
      var spring = new Spring(this, segment.previous.point, point, this.strength);
      this.springs.push(spring);
    }
  }
  this.path.position.x -= this.size.width / 4;
  return this.path;
}

var Spring = function (wave, a, b, strength, restLength) {
  this.a = a;
  this.b = b;
  this.restLength = restLength || 80;
  this.strength = strength ? strength : 0.55;
  this.wave = wave;
  this.mamb = wave.values.invMass * wave.values.invMass;
};

Spring.prototype.update = function () {
  var delta = this.b - this.a;
  var dist = delta.length;
  var normDistStrength = (dist - this.restLength) /
    (dist * this.mamb) * this.strength;
  delta.y *= normDistStrength * this.wave.values.invMass * 0.2;
  if (!this.a.fixed)
    this.a.y += delta.y;
  if (!this.b.fixed)
    this.b.y -= delta.y;
};

function onResize() {

  for (var i = 0; i < waves.length; i++) {
    var wave = waves[i];
    if (wave.path) {
      wave.path.remove();
    }

    wave.size = view.bounds.size * [2, 1];
    wave.path = wave.createPath();
    if (view.bounds.size._width < 770) {
      wave.path.remove();
    }
  }
}

function onMouseMove(event) {
  for (var i = 0; i < waves.length; i++) {
    var wave = waves[i];
    var location = wave.path.getNearestLocation(event.point);
    var segment = location.segment;
    var point = segment.point;
    if (!point.fixed && location.distance < wave.size.height / 4) {
      var y = event.point.y;
      point.y += (y - point.y) / 6;
      if (segment.previous && !segment.previous.fixed) {
        var previous = segment.previous.point;
        previous.y += (y - previous.y) / 24;
      }
      if (segment.next && !segment.next.fixed) {
        var next = segment.next.point;
        next.y += (y - next.y) / 24;
      }
    }
  }
}

function onFrame(event) {
  updateWaves();
}

function updateWaves() {
  for (var i = 0; i < waves.length; i++) {
    var wave = waves[i];
    wave.updateWave();
  }
}
