var assert = require("assert"),
	parser = require("../src/custom-modules/restr-param-parser");

describe("RestrParamParser", function() {

	describe("parseParams", function() {

		it("does not throw error if no params passed", function() {
			assert.doesNotThrow( function() {
				parser.parseParams();
				parser.parseParams({});
				parser.parseParams({
					body: null
				});
				parser.parseParams({
					query: null
				});
				parser.parseParams({
					query: null,
					body: null
				});
				parser.parseParams({
					query: {}
				});
			}, Error );
		});

		it("parses query params", function() {
			assert.deepEqual(
				parser.parseParams({
					query: {
						name: "string",
						quantity: "number"
					}
				}),
				[
					{
						type: "string",
						place: "query",
						name: "name"
					},
					{
						type: "number",
						place: "query",
						name: "quantity"
					}
				]
			);
		});

		it("parses body params", function() {
			assert.deepEqual(
				parser.parseParams({
					body: {
						name: "string",
						quantity: "number"
					}
				}),
				[
					{
						type: "string",
						place: "body",
						name: "name"
					},
					{
						type: "number",
						place: "body",
						name: "quantity"
					}
				]
			);
		});

		it("parses body and query params", function() {
			assert.deepEqual(
				parser.parseParams({
					query: {
						name: "string"
					},
					body: {
						quantity: "number"
					}
				}),
				[
					{
						type: "string",
						place: "query",
						name: "name"
					},
					{
						type: "number",
						place: "body",
						name: "quantity"
					}
				]
			);
		});

	});

});