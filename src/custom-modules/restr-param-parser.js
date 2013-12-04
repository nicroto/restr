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
		var self = this,
			result = [];

		Object.keys(conf).forEach(function(name) {
			var param = conf[name];
			var parsedParam = self.parseParam(param);

			parsedParam.place = place;
			parsedParam.name = name;

			result.push( parsedParam );
		});
		return result;
	},

	parseParam: function(param) {
		var result = {};
		if ( param instanceof Array ) {
			var arrayType = param[0];
			result.type = "array";
			result.arrayType = arrayType;
		} else {
			result.type = param;
		}
		return result;
	}

};

module.exports = ParamParser;