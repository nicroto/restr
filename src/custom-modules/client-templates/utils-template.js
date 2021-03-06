var utils = {

	validateStringArgument: function(arg) {
		if ( typeof(arg) !== "string" ) {
			throw new Error("argument is not a string.");
		}
	},

	validateNumberArgument: function(arg) {
		if ( typeof(arg) !== "number" ) {
			throw new Error("argument is not a number.");
		}
	},

	validateBoolArgument: function(arg) {
		if ( arg !== true && arg !== false ) {
			throw new Error("argument is not a boolean.");
		}
	},

	validateArrayArgument: function(array, type) {
		if ( !array || !(array instanceof Array) ) {
			throw new Error("passed argument isn't array (or no passed argument).");
		}

		if ( !type || typeof(type) !== "string" ) {
			throw new Error("no valid type passed.");
		}

		for ( var i = 0; i < array.length; i++ ) {
			if ( typeof(array[i]) !== type ) {
				throw new Error("array has an argument which is not of type: " + type + ".");
			}
		}
	},

	validateObjectArgument: function(arg) {
		if ( !arg || typeof(arg) !== "object" ) {
			throw new Error("argument is not an object.");
		}

		// no-circular reference validation
		var map = [];
		var isInMap = function(map, element) {
			for ( var i = 0; i < map.length; i++ ) {
				if ( map[i] === element ) {
					return true;
				}
			}
			return false;
		};
		var checkProp = function(prop) {
			if ( prop instanceof Array ) {
				for ( var i = 0; i < prop.length; i++ ) {
					checkProp(prop[i]);
				}
			} else if ( typeof(prop) === "object" ) {
				if ( isInMap(prop) ) {
					throw new Error("circular reference in the object passed for cloning.");
				}
				map.push( prop );
				checkImmediateProps( prop );
			}
		};
		var checkImmediateProps = function(object) {
			Object.keys(object).forEach( function(key) {
				var prop = object[key];
				checkProp(prop);
			} );
		};
		checkImmediateProps(arg);
	},

	combinePaths: function() {
		if ( arguments.length === 0 ) {
			throw new Error("no arguments passed!");
		}

		var self = this,
			paths = arguments,
			result = paths[0];

		self.validateStringArgument(result);

		for ( var i = 1; i < paths.length; i++ ) {
			var delimiter = "/",
				path = paths[i];

			self.validateStringArgument(path);

			if ( result[result.length - 1] === "/" ) {
				result = result.slice(0, -1);
			}
			if ( path[0] === "/" ) {
				delimiter = "";
			}
			result += delimiter + paths[i];
		}

		return result;
	},

	cloneObject: function(source) {
		var self = this,
			clone = {};
		Object.keys(source).forEach( function(key) {
			var prop = source[key];
			clone[key] = self.cloneProp(prop);
		} );

		return clone;
	},

	cloneProp: function(prop) {
		var self = this,
			propClone;
		if ( prop instanceof Array ) {
			propClone = self.cloneArray( prop );
		} else if ( typeof(prop) === "object" ) {
			propClone = self.cloneObject( prop );
		} else {
			propClone = prop;
		}
		return propClone;
	},

	cloneArray: function(array) {
		var self = this,
			result = [];
		for ( var i = 0; i < array.length; i++ ) {
			result.push( self.cloneProp(array[i]) );
		}
		return result;
	}

};