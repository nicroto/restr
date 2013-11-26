'use strict';

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

		if ( !spec ) {
			throw new Error("Restr: Loader: loadService: no spec passed.");
		}

		if ( !spec.methods || !spec.methods.length ) {
			throw new Error("Restr: Loader: loadService: no methods in the spec.");
		}

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

		try {
			self.validateRoot( route );
			self.validateName( name );
			self.validateVerb( verb );
			self.validateLogic( logic );
		} catch (error) {
			return;
		}

		if ( self.expressApp ) {
			var finalFunc = serviceSelf[name] = function() {
				return logic.apply(serviceSelf, arguments);
			};
			self.expressApp[verb]( route, finalFunc );
		} else if ( self.customLoader ) {
			self.customLoader(serviceSelf, route, verb, logic);
		} else {
			throw new Error("Restr: Loader: loadMethod: no loader available. Check the documentation for the proper ways of initialization.");
		}
	},

	validateRoot: function(route) {
		// TODO:
		if ( typeof(route) !== "string" ) {
			throw new Error("Restr: Loader: validateRoot: passed argument isn't string.");
		}
	},

	validateName: function(name) {
		var match = name.match(/^([$a-z_A-Z]+[0-9]*)+$/);
		if ( !(match.length && match.length > 0) ) {
			throw new Error("Restr: Loader: validateName: method.name should be a valid js function name.");
		}
	},

	validateVerb: function(verb) {
		if( !(
			verb === "get" ||
			verb === "post" ||
			verb === "put" ||
			verb === "delete"
		) ) {
			throw new Error("Restr: Loader: validateVerb: verb should be get, post, put or delete, but not" + verb + ".");
		}
	},

	validateLogic: function(logic) {
		var getType = {};
		if ( !(logic && getType.toString.call(logic) === '[object Function]') ) {
			throw new Error("Restr: Loader: validateLogic: no logic passed for the method. Should be function.");
		}
	}

};

module.exports = Loader;