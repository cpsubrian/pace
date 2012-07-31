Pace
====

A node.js module that outputs a progress bar and other metrics to the command-line.
It was originally conceived to help measure the 'pace' of long running scripts.
We've used it to optimize scripts that would have taken hours to complete down
to minutes, without having to wait the hours before knowing that the script
could use some optimization.

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

Usage
-----
### `Pace` object ###
The module exports a factory function to generate instances of `Pace` objects.
So `require('pace')(<options>)` creates an instance of `Pace`, passing
`options` to the constructor.

### Options ###
Options can either be an object literal, or an integer.  If its an integer then
it is the same as passing options with only the `total` specified.

```
require('pace')(100);

// Same as

require('pace')({total: 100});
```

Supported Options:

  * `total` - The total number of operations that _YOUR_ script will execute.
  * `maxBurden` - The maximum 'burden' that the progress bar should incur. See more about burden below.
  * `showBurden` - Mostly for debugging.  Show the current burden / skipped steps with the other metrics.

### pace.op([count]) ###
Signal to pace that an operation was completed in your script by calling
`pace.op()`.

If you would rather track the progress in your own logic, you can call
`pace.op(<count>)` where `<count>` is the current operation interation
(for example step # 50 of a 100 step process).

### pace.total ###
If your script has a dynamic amount of work to do (for example, depending on the
results of previous operation there may be more steps to complete), you can
freely change the value of pace.total.  Just set the value like: `pace.total = 200`.

Burden
------
Depending on how intensive your operations are, calculating, formatting, and
printing the progress bar might be much more expensive than the work you
are doing.  It would be silly if printing a progress bar caused your
job to take significantly longer than it would have otherwise. _Pace_ tracks
a stat called 'burden', which is basically a percentage of the overall
execution time that is being spent inside the progress bar logic itself.

The default `maxBurden` is `0.5`, which translates to `0.5% of the total execution
time`.  If this low burden is causing you to see progress reported less
often than you would prefer, you can raise it to something like `20` (20%) via
the `maxBurden` option.

Examples
--------
The `test/` folder contains some simple test scripts you can run to see the
progress bar in action.
