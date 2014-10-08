/**
 * Simple test of pace.js.
 *
 * Show error count
 */

var total = 5000,
    count = 0,
    pace = require('../')({total: total, showBurden: true, maxBurden: 0.5, finishMessage: "This is the best Node.js progress bar", errorMessage: "This is a Custom Error Message"});

while (count++ < total) {
 count % 2 == 0 ? pace.op({errors: 1}) : pace.op();
  // Cause some work to be done.
  for (var i = 0; i < 1000000; i++) {
    count = count;
  }
}
