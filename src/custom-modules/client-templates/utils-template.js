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
	}

};