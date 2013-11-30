var assert = require("assert"),
	utils = require("../src/custom-modules/restr-client-utils.js");

describe("utils", function() {

	describe("validateStringArgument", function() {

		it("should throw error if argument is not string", function() {
			assert.throws( function() {
				utils.validateStringArgument();
			}, Error );
			assert.throws( function() {
				utils.validateStringArgument(1234);
			}, Error );
			assert.throws( function() {
				utils.validateStringArgument({});
			}, Error );
			assert.throws( function() {
				utils.validateStringArgument(function() {});
			}, Error );
		});

		it("it shouldn't throw error if argument is string", function() {
			assert.doesNotThrow( function() {
				utils.validateStringArgument("1234");
			}, Error );
			assert.doesNotThrow( function() {
				utils.validateStringArgument("");
			}, Error );
		});

	});

	describe("validateNumberArgument", function() {

		it("should throw error if argument is not a number", function() {
			assert.throws( function() {
				utils.validateNumberArgument();
			}, Error, "no argument" );
			assert.throws( function() {
				utils.validateNumberArgument("1234");
			}, Error, "string passed" );
			assert.throws( function() {
				utils.validateNumberArgument({});
			}, Error, "object passed" );
			assert.throws( function() {
				utils.validateNumberArgument(function() {});
			}, Error, "function passed" );
		});

		it("it shouldn't throw error if argument is number", function() {
			assert.doesNotThrow( function() {
				utils.validateNumberArgument(1234);
			}, Error );
			assert.doesNotThrow( function() {
				utils.validateNumberArgument(1.2344);
			}, Error );
		});

	});

	describe("combinePaths", function() {

		it("should throw error if no paths passed", function() {
			assert.throws( function() {
				utils.combinePaths();
			}, Error, "no arguments" );
		});

		it("should throw error if non-string argument is passed", function() {
			assert.throws( function() {
				utils.combinePaths("root", {});
			}, Error, "object passed along with strings" );
			assert.throws( function() {
				utils.combinePaths(123, "second/part");
			}, Error, "number passed along with strings" );
		});

		it("shouldn't double slashes", function() {
			assert.equal(
				utils.combinePaths("one/", "/two", "three"),
				"one/two/three"
			);
			assert.equal(
				utils.combinePaths("one", "two", "three"),
				"one/two/three"
			);
			assert.equal(
				utils.combinePaths("one", "two/", "/three"),
				"one/two/three"
			);
			assert.equal(
				utils.combinePaths("one/", "/two/", "/three"),
				"one/two/three"
			);
		});

	});

});