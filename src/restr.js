'use strict';

var validator = require("./custom-modules/restr-spec-validator"),
	ClientGenerator = require("./custom-modules/restr-client-generator.js"),
	Loader = require("./custom-modules/restr-loader.js"),
	generator = new ClientGenerator();

var Restr = {

	RestrLoader: Loader,

	validateSpecs: function(specs) {
		for ( var i = 0; i < specs.length; i++ ) {
			validator.validateServiceSpec(specs[i]);
		}
	},

	generateClient: function(specs) {
		return generator.render(specs);
	}

};

module.exports = Restr;