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
