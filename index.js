"use strict";

const charm = require('charm');

const Pace  = require('./pace.js');

module.exports = function(options) {

	if (typeof options === 'number') {
		options = {
			total: options
		};
	}
	return new Pace(options);
};
