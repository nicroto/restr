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
		var self = this;
		var result;
		if ( param instanceof Array ) {
			var type = param[0];
			if ( typeof(type) === "object" ) {
				type = self.parseObject(type);
			}
			result = {
				type: "array",
				arrayType: type
			};
		} else if ( typeof(param) === "object" ) {
			result = self.parseObject(param);
		} else {
			result = {
				type: param
			};
		}
		return result;
	},

	parseObject: function(source) {
		var self = this;
		var parsedObject = {
			type: "object",
			params: []
		};

		Object.keys(source).forEach( function(key) {
			var prop = source[key];
			var param = self.parseParam(prop);
			param.name = key;
			parsedObject.params.push( param );
		} );

		return parsedObject;
	}

};

module.exports = ParamParser;