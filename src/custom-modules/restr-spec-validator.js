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

		for ( var i = 0; i < methods.length; i++ ) {
			self.validateMethodSpec( methods[i] );
		}
	},

	validateMethodSpec: function(spec) {
		var self = this;

		self.validateRoot( spec.route );
		self.validateName( spec.name );
		self.validateVerb( spec.verb );
		self.validateLogic( spec.logic );
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
		if ( !params ) {
			return;
		}

		for ( var i = 0; i < params.length; i++ ) {
			var param = params[i],
				type = param.type,
				place = param.place,
				name = param.name;

			// missing prop
			if ( !type || !place || !name ) {
				throw new Error("A property (type, place or name) is missing from the spec.");
			}

			// property is not a string
			if ( typeof type !== "string" || typeof place !== "string" || typeof name !== "string" ) {
				throw new Error("all param spec properties should have string values.");
			}

			// unknown type
			if ( type !== "string" && type !== "number" ) {
				throw new Error("unknown type is specified in the spec.");
			}

			// unknown place
			if ( place !== "query" && place !== "body" ) {
				throw new Error("unknown place to send parameter in is specified in the spec.");
			}
		}
	}

};

module.exports = SpecValidator;