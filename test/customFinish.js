/**
 * Simple test of pace.js.
 *
 * Send a custom finish message
 */

var total = 500,
    count = 0,
    pace = require('../')({total: total, showBurden: true, maxBurden: 0.5, finishMessage: "This is the best Node.js progress bar"});

while (count++ < total) {
  pace.op();

  // Cause some work to be done.
  for (var i = 0; i < 1000000; i++) {
    count = count;
  }
}
