'use strict';

var validator = require("./restr-spec-validator");

var ParamParser = {

	parseParams: function(conf) {
		var self = this,
			result = [];

		if ( !conf ) {
			return result;
		}

		validator.validateParams(conf);

		if ( conf.query ) {
			result = result.concat( self.parseSection("query", conf.query) );
		}
		if ( conf.body ) {
			result = result.concat( self.parseSection("body", conf.body) );
		}

		return result;
	},

	parseSection: function(place, conf) {
		var result = [];
		Object.keys(conf).forEach(function(name) {
			var type = conf[name];
			result.push( {
				type: type,
				place: place,
				name: name
			} );
		});
		return result;
	}

};

module.exports = ParamParser;