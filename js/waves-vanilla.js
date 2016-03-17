paper.install(window);
window.onload = function () {
  // Get a reference to the canvas object
  var canvas = document.getElementById('canvas');
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);
  var tool = new Tool();
tool.activate();
  var color1 = new Color('#F0DB4F');
  var color2 = new Color('#29d9c2');
  color2.alpha = 0.5;
  var color3 = new Color('#01a2a6');
  color3.alpha = 0.5;
  var color4 = new Color('#272933');

  var waves = [new Wave(color4, 0.07), new Wave(color3, 0.08), new Wave(color2, 0.09), new Wave(color1, 0.05)];
  for (var i = 0; i < waves.length; i++) {
    var wave = waves[i];
    wave.createPath();
  }

  view.onFrame = function () {
    for (var i = 0; i < waves.length; i++) {
      var wave = waves[i];
      wave.updateWave();
    }
  }

  view.onResize = function(event) {
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
  };

  view.draw();

  tool.onMouseMove = function (event) {
    for (var i = 0; i < waves.length; i++) {
      var wave = waves[i];

      var location = wave.path.getNearestLocation(event.point);
      console.log(location);
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
  };


}
