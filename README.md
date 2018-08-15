# awesome-progress

A node.js module that outputs a progress bar and other metrics to the command-line. It was originally conceived to help measure the 'pace' of long running scripts.

We've used it to optimize scripts that would have taken hours to complete down to minutes, without having to wait the hours before knowing that the script could use some optimization.

![Screenshot with Error Feature](https://s22.postimg.cc/5mdxlrsk1/awesome-progress.gif)

> **Note**: This module is not longer maintained but you are welcome to PR or fork. You might want to check:
> - [ascii-progress - Ascii progress-bar(s) in the terminal](https://github.com/bubkoo/ascii-progress)
> - [node-multimeter - render multiple progress bars at once on the terminal](https://github.com/substack/node-multimeter)

**Installation**

```
$ npm install pace
```

**Example**

Running the following code:

```js
var total = 50000,
    count = 0,
    pace = require('pace')(total);

while (count++ < total) {
  pace.op();

  // Cause some work to be done.
  for (var i = 0; i < 1000000; i++) {
    count = count;
  }
}
```

## Usage

### `Pace` object

The module exports a factory function to generate instances of `Pace` objects. So `require('pace')(<options>)` creates an instance of `Pace`, passing `options` to the constructor.

### Options

Options can either be an object literal, or an integer.  If its an integer then it is the same as passing options with only the `total` specified.

```js
require('pace')(100);

// Same as

require('pace')({total: 100});
```

Supported Options:

  * `total` - The total number of operations that _YOUR_ script will execute.
  * `maxBurden` - The maximum 'burden' that the progress bar should incur. See more about burden below.
  * `showBurden` - Mostly for debugging.  Show the current burden / skipped steps with the other metrics.
  * `hideFinishMessage` - Hides the message displayed when the progress bar finishes. Default: `False`
  * `finishMessage` - Pass a custom message to display when the progress bar finishes. Default: `Finished!`
  * `errorMessage` - Pass a custom message to display when a signal error has been passed.

### pace.op([count])

Signal to pace that an operation was completed in your script by calling `pace.op()`.

If you would rather track the progress in your own logic, you can call `pace.op(<count>)` where `<count>` is the current operation interation (for example step # 50 of a 100 step process).

### pace.op({errors: count})

Signal to pace that an error has happened. This will automatically signal a normal `count` increase but will also increase the error counter shown under the progress bar.
**Note:** The errors count can be passed to be more than one, however each error signal triggers one `op()` count.

### pace.total

If your script has a dynamic amount of work to do (for example, depending on the results of previous operation there may be more steps to complete), you can freely change the value of pace.total.  Just set the value like: `pace.total = 200`.

### Burden


Depending on how intensive your operations are, calculating, formatting, and printing the progress bar might be much more expensive than the work you are doing.  It would be silly if printing a progress bar caused your job to take significantly longer than it would have otherwise. _Pace_ tracks a stat called 'burden', which is basically a percentage of the overall execution time that is being spent inside the progress bar logic itself.

The default `maxBurden` is `0.5`, which translates to `0.5% of the total execution time`.  If this low burden is causing you to see progress reported less often than you would prefer, you can raise it to something like `20` (20%) via the `maxBurden` option.

### Examples

The `test/` folder contains some simple test scripts you can run to see the progress bar in action.

## Common Issues

### Multiple writes and wrong progress bar rendering

If you have multiple instances of `pace` running in various parts of your application, from the second run onwards you might notice that the progress bar is not rendered correctly with duplicate output.
This effect is additive for each time `pace` is required with the same stream.

**Cause:** The problem is with `pace` dependency `charm`. In node.js 0.10 the EventEmitter constructor explicitly initializes `this._events`, so going `Charm.prototype = new Stream;` causes all Charm instances to share the same _events property.

**Fix:** Change the `charm` main module file `index.js` and replace `Charm.prototype = new Stream;` with `Charm.prototype = Stream.prototype;`

**References:**
  * [substack/node-charm/#18](https://github.com/substack/node-charm/pull/18)
