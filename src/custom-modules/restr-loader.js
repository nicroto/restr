'use strict';

var validator = require("./restr-spec-validator");

var Loader = function(expressApp) {
	var self = this;
	self.expressApp = expressApp;
};

Loader.prototype = {

	customLoader: null,

	loadServices: function(specs) {
		var self = this;

		if ( !specs || !specs.length ) {
			throw new Error("Restr: Loader: loadServices: no services passed for loading.");
		}

		for ( var i = 0; i < specs.length; i++ ) {
			self.loadService( specs[i] );
		}
	},

	loadService: function(spec) {
		var self = this;

		validator.validateServiceSpec(spec);

		var methods = spec.methods,
			serviceSelf = {};
		for ( var i = 0; i < methods.length; i++ ) {
			self.loadMethod(serviceSelf, methods[i]);
		}

		return serviceSelf;
	},

	loadMethod: function(serviceSelf, method) {
		var self = this,
			route = method.route,
			name = method.name,
			verb = method.verb,
			logic = method.logic;

		if ( self.expressApp ) {
			var finalFunc = serviceSelf[name] = function() {
				return logic.apply(serviceSelf, arguments);
			};
			self.expressApp[verb]( route, finalFunc );
		} else if ( self.customLoader ) {
			self.customLoader(serviceSelf, name, route, verb, logic);
		} else {
			throw new Error("Restr: Loader: loadMethod: no loader available. Check the documentation for the proper ways of initialization.");
		}
	}

};

module.exports = Loader;