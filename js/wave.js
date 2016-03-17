function Wave(fillColor, strength) {
  this.strength = strength;
  this.fillColor = fillColor;
  this.path;
  this.values = {
    friction: 0.2,
    timeStep: 0.15,
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
