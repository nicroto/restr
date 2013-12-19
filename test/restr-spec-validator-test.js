var assert = require("assert"),
	validator = require("../src/custom-modules/restr-spec-validator");

var badTypeParams1 = {
		query: {
			name: "string1111"
		}
	},
	badTypeParams2 = {
		query: {
			name: 1111
		}
	},
	badPlaceParams = {
		queryASD: {
			name: "string"
		}
	},
	badNameParams = {
		query: {
			" name": "string"
		}
	},
	badArrayParam = {
		query: {
			tags: []
		}
	};

var goodServiceSpec = {
	name: "userService",
	methods: [
		{
			route: "/api/user/:id/:otherId?",
			name: "updateUser",
			params: {
				query: {
					name: "string",
					skills: ["string"]
				},
				body: {
					description: "string",
					prizes: ["number"],
					profile: {
						fullName: "string",
						picUrls: ["string"],
						collegues: {
							employeeIds: ["number"],
							bossIds: ["number"]
						}
					}
				}
			},
			verb: "put",
			logic: function(req, res, id) {
				if ( req && res && id ) {}

				return true;
			}
		}
	]
};

describe("RestrSpecValidator", function() {

	describe("validateServiceSpec", function() {

		it("should throw error if no spec is passed", function() {
			assert.throws( function() {
				validator.validateServiceSpec();
			}, Error );
		});

		it("should throw error if no methods are specified (no prop)", function() {
			assert.throws( function() {
				validator.validateServiceSpec({});
			}, Error );
		});

		it("should throw error if no methods are specified (null prop)", function() {
			assert.throws( function() {
				validator.validateServiceSpec( { methods: null } );
			}, Error );
		});

		it("should throw error if no methods are specified (empty array)", function() {
			assert.throws( function() {
				validator.validateServiceSpec( { methods: [] } );
			}, Error );
		});

		it("shouldn't throw error when spec is correct", function() {
			validator.validateServiceSpec( goodServiceSpec );
		});

	});

	describe("validateRoot", function() {

		it("should throw error if non-string passed", function() {
			assert.throws( function() {
				validator.validateRoot({});
			}, Error );
		});

	});

	describe("validateName", function() {

		it("should throw error if it has spaces", function() {
			assert.throws( function() {
				validator.validateName(" name");
			}, Error );
		});

		it("should throw error if starting with number", function() {
			assert.throws( function() {
				validator.validateName("1name");
			}, Error );
		});

		it("should throw error if contains non-allowed symbols", function() {
			assert.throws( function() {
				validator.validateName("#name");
			}, Error );
			assert.throws( function() {
				validator.validateName("name.");
			}, Error );
			assert.throws( function() {
				validator.validateName("+name");
			}, Error );
			assert.throws( function() {
				validator.validateName("name&");
			}, Error );
		});

		it("should not throw an error if valid name", function() {
			validator.validateName("name");
			validator.validateName("name$");
			validator.validateName("$name");
			validator.validateName("$elABcd123");
		});

	});

	describe("validateVerb", function() {

		it("should throw error if unknown verb is used", function() {
			assert.throws( function() {
				validator.validateVerb("remove");
			}, Error );
		});

		it("should not throw error if known verb is used", function() {
			validator.validateVerb("get");
			validator.validateVerb("post");
			validator.validateVerb("put");
			validator.validateVerb("delete");
		});

	});

	describe("validateLogic", function() {

		it("should throw error if no argument passed", function() {
			assert.throws( function() {
				validator.validateLogic();
			}, Error );
		});

		it("should throw error if object is passed", function() {
			assert.throws( function() {
				validator.validateLogic({});
			}, Error );
		});

		it("should not throw error if function is passed", function() {
			validator.validateLogic(function() {});
		});

	});

	describe("validateParams", function() {

		it("shouldn't throw error if no argument passed", function() {
			assert.doesNotThrow( function() {
				validator.validateParams();
			}, Error );
		});

		it("should throw error if params passed isn't an object", function() {
			assert.throws( function() {
				validator.validateParams(function(){});
			}, Error );
		});

		it("should throw error if unknown type specified", function() {
			assert.throws( function() {
				validator.validateParams(badTypeParams1);
			}, Error );
		});

		it("should throw error if a property is not a string", function() {
			assert.throws( function() {
				validator.validateParams(badTypeParams2);
			}, Error );
		});

		it("should throw error if unknown section is used (non query or body)", function() {
			assert.throws( function() {
				validator.validateParams(badPlaceParams);
			}, Error );
		});

		it("should throw error if a prop is missing (type, place or name`)", function() {
			assert.throws( function() {
				validator.validateParams(badNameParams);
			}, Error );
		});

		it("should throw error if a prop is an array without type specified", function() {
			assert.throws( function() {
				validator.validateParams(badArrayParam);
			}, Error );
		});

		it("shouldn't throw error if a prop is optional", function() {
			assert.doesNotThrow( function() {
				validator.validateParams( {
					query: {
						"verified?": "bool"
					}
				} );
			}, Error );
		});

	});

	describe("validateParam", function() {

		it("shouldn't throw error on valid array param", function() {
			assert.doesNotThrow( function() {
				validator.validateParam([{}]);
			}, Error, "arrayType is an empty object" );
			assert.doesNotThrow( function() {
				validator.validateParam([{
					tags: [{
						id: "number",
						name: "string"
					}]
				}]);
			}, Error, "arrayType is an empty object" );
		});

		it("shouldn't throw error on bool param", function() {
			assert.doesNotThrow( function() {
				validator.validateParam("bool");
			}, Error );
		});

	});

});