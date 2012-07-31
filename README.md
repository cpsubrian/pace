Pace
====

A node.js module that outputs a progress bar and other metrics to the command-line.

Installation
------------
```
$ npm install pace
```

Example
-------
Running the following code:
```
var total = 50000,
    count = 0,
    pace = require('../')(total);

while (count++ < total) {
  pace.op();

  // Cause some work to be done.
  for (var i = 0; i < 1000000; i++) {
    count = count;
  }
}
```

Will cause output to your console similar to:
![Sample progress bar output](https://github.com/cantina/pace/raw/master/screenshot.png)
