"use strict";

const charm = require('charm');

const utils  = require('./utils');

class Pace {

	constructor(options) {

		options = options || {};

		if (!options.total) {
			throw new Error('You MUST specify the total number of operations that will be processed.');
		}

		this.total = options.total;
		this.hideFinishMessage = options.hideFinishMessage || false;
		this.finishMessage = options.finishMessage || "Finished!";
		this.errorMessage = options.errorMessage;

		this.current = 0;
		this.errors = 0;

		this.max_burden = options.maxBurden || 0.5;

		this.show_burden = options.showBurden || false;

		this.started = false;
		this.size = 50;
		this.inner_time = 0;
		this.outer_time = 0;
		this.elapsed = 0;
		this.start = 0;
		this.time_start = 0;
		this.time_end = 0;
		this.time_left = 0;
		this.time_burden = 0;
		this.skip_steps = 0;
		this.skipped = 0;
		this.aborted = false;

		this.charm = charm();
		this.charm.pipe(process.stdout);

		this.charm.write("\n\n\n");
	}

	op(signal) {

		if (signal && !signal.errors) {
			if (this.current == 0) this.start = signal;
			this.current = signal;
		} else this.current++;

		if (signal && signal.errors) {
			this.errors += signal.errors ? signal.errors : 1;
		}

		if (this.burdenReached()) return;

		if (!this.started) this.started = new Date().getTime();

		this.time_start = new Date().getTime();

		this.updateTimes();
		this.clear();
		this.outputProgress();
		this.outputStats();
		this.outputTimes();
		this.outputErrors();

		if (this.current >= this.total) this.finished();

		this.time_end = new Date().getTime();
		this.inner_time = this.time_end - this.time_start;
	};

	updateTimes() {

		this.elapsed = this.time_start - this.started;

		if (this.time_end > 0)  this.outer_time = this.time_start - this.time_end;
		if (this.inner_time > 0 && this.outer_time > 0) {

			this.time_burden = (this.inner_time / (this.inner_time + this.outer_time)) * 100;
			this.time_left = (this.elapsed / (this.current - this.start)) * (this.total - this.current);

			if (this.time_left < 0) this.time_left = 0;
		}

		if (this.time_burden > this.max_burden && (this.skip_steps < (this.total / this.size))) {
			this.skip_steps = Math.floor(++this.skip_steps * 1.3);
		}
	};

	clear() {
		this.charm.erase('line').up(1).erase('line').up(1).erase('line').write("\r");
	};

	outputProgress() {

		this.charm.write('Processing: ');
		this.charm.foreground('green').background('green');

		for (var i = 0; i < ((this.current / this.total) * this.size) - 1; i++) {
			this.charm.write(' ');
		}
		this.charm.foreground('white').background('white');
		while (i < this.size - 1) {
			this.charm.write(' ');
			i++;
		}
		this.charm.display('reset').down(1).left(100);
	};

	outputStats() {
		this.perc = (this.current / this.total) * 100;
		this.perc = utils.padLeft(this.perc.toFixed(2), 2);
		this.charm.write('            ').display('bright').write(this.perc + '%').display('reset');
		this.total_len = utils.formatNumber(this.total).length;
		this.charm.write('   ').display('bright').write(utils.padLeft(utils.formatNumber(this.current), this.total_len)).display('reset');
		this.charm.write('/' + utils.formatNumber(this.total));

		// Output burden.
		if (this.show_burden) {
			this.charm.write('    ').display('bright').write('Burden: ').display('reset');
			this.charm.write(this.time_burden.toFixed(2) + '% / ' + this.skip_steps);
		}

		this.charm.display('reset').down(1).left(100);
	};

	outputTimes() {

		var hours = Math.floor(this.elapsed / (1000 * 60 * 60));
		var min   = Math.floor(((this.elapsed / 1000) % (60 * 60)) / 60);
		var sec   = Math.floor((this.elapsed / 1000) % 60);

		this.charm.write('            ').display('bright').write('Elapsed: ').display('reset');
		this.charm.write(hours + 'h ' + min + 'm ' + sec + 's');

		if (this.time_left) {
			hours = Math.floor(this.time_left / (1000 * 60 * 60));
			min = Math.floor(((this.time_left / 1000) % (60 * 60)) / 60);
			sec = Math.ceil((this.time_left / 1000) % 60);

			this.charm.write('   ').display('bright').write('Remaining: ').display('reset');
			this.charm.write(hours + 'h ' + min + 'm ' + sec + 's');
		}
	};

	outputErrors() {
		this.charm.write('     ').display('bright').foreground('red').write('Errors: ' + this.errors).write('   ').display('reset');
	}

	finished() {
		this.charm.write("\n");
		if (!this.hideFinishMessage) {
			this.charm.write('\n' + this.finishMessage + '\n');
			if (this.errors && this.errorMessage) this.charm.foreground('red').write('\n' + this.errorMessage + '\n').display('reset');
		} else this.charm.write("\n");
	};

	burdenReached() {
		if ((this.skip_steps > 0) && (this.current < this.total)) {
			if (this.skipped < this.skip_steps) {
				this.skipped++;
				return true;
			} else {
				this.skipped = 0;
			}
		}
		return false;
	};
}

module.exports = Pace;
