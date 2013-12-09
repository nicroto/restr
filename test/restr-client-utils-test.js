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

	describe("validateArrayArgument", function() {

		it("should throw error if there is a wrong type element of the array", function() {
			assert.throws( function() {
				utils.validateArrayArgument();
			}, Error, "no argument" );
			assert.throws( function() {
				utils.validateArrayArgument([]);
			}, Error, "no type specified" );
			assert.throws( function() {
				utils.validateArrayArgument([], 1);
			}, Error, "bad type argument" );
			assert.throws( function() {
				utils.validateArrayArgument("", "string");
			}, Error, "bad array argument" );
			assert.throws( function() {
				utils.validateArrayArgument(["asda",1231], "string");
			}, Error, "invalid array containing multiple types" );
		});

		it("it shouldn't throw error if correct arguments passed", function() {
			assert.doesNotThrow( function() {
				utils.validateArrayArgument([], "string");
			}, Error, "empty array is a valid array, no matter the type" );
			assert.doesNotThrow( function() {
				utils.validateArrayArgument(["aasd","asdasddd"], "string");
			}, Error, "string array" );
			assert.doesNotThrow( function() {
				utils.validateArrayArgument([123,12312,3123,123,123], "number");
			}, Error, "number array" );
		});

	});

	describe("validateObjectArgument", function() {

		it("should throw error if wrong type of argument is passed", function() {
			assert.throws( function() {
				utils.validateObjectArgument();
			}, Error, "no argument" );
			assert.throws( function() {
				utils.validateObjectArgument("string ");
			}, Error, "string" );
			assert.throws( function() {
				utils.validateObjectArgument(1234421);
			}, Error, "number" );
			assert.throws( function() {
				utils.validateObjectArgument(function() {});
			}, Error, "function" );
		});

		it("should throw error on circular reference", function() {
			assert.throws( function() {
				var a = {},
					b = { a: a };

				a.b = b;

				utils.validateObjectArgument(a);
			}, Error );
		});

		it("it shouldn't throw error if correct argument is passed", function() {
			assert.doesNotThrow( function() {
				utils.validateObjectArgument({});
			}, Error, "empty object" );
			assert.doesNotThrow( function() {
				utils.validateObjectArgument({
					name: "Nikolay Tsenkov"
				});
			}, Error, "string array" );
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

	describe("cloneObject", function() {

		it("should clone objects having all supported types (including inner object)", function() {
			assert.deepEqual(
				utils.cloneObject( {
					fullName: "Nikolay Tsenkov",
					picUrls: ["http://sphotos-e.ak.fbcdn.net/hphotos-ak-ash2/306865_4399867203696_922117823_n.jpg"],
					collegues: {
						employeeIds: [123123333,1231245323,11223423],
						bossIds: []
					}
				} ),
				{
					fullName: "Nikolay Tsenkov",
					picUrls: ["http://sphotos-e.ak.fbcdn.net/hphotos-ak-ash2/306865_4399867203696_922117823_n.jpg"],
					collegues: {
						employeeIds: [123123333,1231245323,11223423],
						bossIds: []
					}
				}
			);
		});

	});

});