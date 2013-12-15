'use strict';

var utils = require("./restr-client-utils");

var SpecValidator = {

	validateServiceSpec: function(spec) {
		var self = this;

		if ( !spec ) {
			throw new Error("no spec passed.");
		}

		if ( !spec.methods || !spec.methods.length ) {
			throw new Error("no methods in the spec.");
		}

		var methods = spec.methods;

		try {
			self.validateName(spec.name);
			for ( var i = 0; i < methods.length; i++ ) {
				self.validateMethodSpec( methods[i] );
			}
		} catch(e) {
			throw new Error([
				e,
				"Error validating spec for " + spec.name
			].join("\n"));
		}
	},

	validateMethodSpec: function(spec) {
		var self = this;

		try {
			self.validateParams( spec.params );
			self.validateRoot( spec.route );
			self.validateName( spec.name );
			self.validateVerb( spec.verb );
			self.validateLogic( spec.logic );
		} catch(e) {
			throw new Error([
				e,
				"Error validating method " + spec.name
			].join("\n"));
		}
	},

	validateRoot: function(route) {
		// TODO:
		if ( typeof(route) !== "string" ) {
			throw new Error("passed argument isn't string.");
		}
	},

	validateName: function(name) {
		var match = name.match(/^([$a-z_A-Z]+[0-9]*)+$/);
		if ( !(match.length && match.length > 0) ) {
			throw new Error("method.name should be a valid js function name.");
		}
	},

	validateVerb: function(verb) {
		if( !(
			verb === "get" ||
			verb === "post" ||
			verb === "put" ||
			verb === "delete"
		) ) {
			throw new Error("verb should be get, post, put or delete, but not" + verb + ".");
		}
	},

	validateLogic: function(logic) {
		var getType = {};
		if ( !(logic && getType.toString.call(logic) === '[object Function]') ) {
			throw new Error("no logic passed for the method. Should be function.");
		}
	},

	validateParams: function(params) {
		var self = this;

		if ( !params ) {
			return;
		}

		if ( typeof params !== "object" ) {
			throw new Error("params section should be specified as an object");
		}

		Object.keys(params).forEach( function(key) {
			if ( key !== "query" && key !== "body" ) {
				throw new Error("Invalid paramter section: " + key + ". Section names are query and body");
			}
			try {
				self.validateParamSection(key, params[key]);
			} catch(e) {
				throw new Error([
					e,
					"Error validating params:"
				].join("\n"));
			}
		} );
	},

	validateParamSection: function(place, conf) {
		var self = this;

		if ( !conf ) {
			return;
		}

		// unknown place
		if ( place !== "query" && place !== "body" ) {
			throw new Error("unknown place to send parameter in is specified in the spec.");
		}

		Object.keys(conf).forEach( function(key) {
			try {
				self.validateName( key );
				self.validateParam( conf[key] );
			} catch(e) {
				throw new Error([
					e,
					"Error validating param:" + key
				].join("\n"));
			}
		} );
	},

	validateParam: function(param) {
		var self = this;
		// unknown type
		if ( param !== "string" && param !== "number" && param !== "bool" ) {
			if ( param instanceof Array ) {
				if ( !param[0] ) {
					throw new Error("array param without a type specified.");
				}
				if ( param[0] instanceof Array ) {
					throw new Error("nested arrays are not supported.");
				}
				self.validateParam(param[0]);
			} else if ( typeof(param) === "object" ) {
				utils.validateObjectArgument(param);
				self.validateObjectParam(param);
			} else if ( typeof(param) !== "object" ) {
				throw new Error("unknown param type is specified in the spec.");
			}
		}
	},

	validateObjectParam: function(object) {
		var self = this;
		Object.keys(object).forEach( function(key) {
			var prop = object[key];
			self.validateParam(prop);
		} );
	}

};

module.exports = SpecValidator;