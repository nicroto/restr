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
			var param = conf[name],
				parsedParam = self.parseParam(param),
				isOptional = self.isOptionalParam(name);

			parsedParam.place = place;
			if ( self.isOptionalParam(name) ) {
				parsedParam.optional = true;
			}
			parsedParam.name = self.parseName(name, isOptional);

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
			var prop = source[key],
				param = self.parseParam(prop),
				isOptional = self.isOptionalParam(key);

			if ( isOptional ) {
				param.optional = true;
			}

			param.name = self.parseName(key, isOptional);
			parsedObject.params.push( param );
		} );

		return parsedObject;
	},

	parseName: function(name, isOptional) {
		if ( isOptional ) {
			name = name.substring(0, name.length - 1);
		}
		return name;
	},

	isOptionalParam: function(name) {
		return name[name.length - 1] === "?";
	}

};

module.exports = ParamParser;