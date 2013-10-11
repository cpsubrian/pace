/**
 * Advanced test of pace.js.
 *
 * Set the current position in op() and also randomly increase the total.
 */

var total = 100,
    current = 0,
    pace = require('../')({
      total : total,
      texts : {
        info : "Downloading: ",
        unit : " bytes",
        finished : "Woohoo!"
      }
    });

while (current++ <= total) {
  if (Math.random() > 0.9 || current === total) {
    pace.op(current);
  }

  if (Math.random() < 0.05 && total <= 50000) {
    total += Math.floor(Math.random() * 100);
    pace.total = total;
  }

  // Cause some work to be done.
  for (var i = 0; i < 100000; i++) {
    current = current;
  }
}
