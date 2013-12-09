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

		it("parses array params", function() {
			assert.deepEqual(
				parser.parseParams({
					query: {
						skills: ["string"]
					},
					body: {
						prizes: ["number"]
					}
				}),
				[
					{
						type: "array",
						arrayType: "string",
						place: "query",
						name: "skills"
					},
					{
						type: "array",
						arrayType: "number",
						place: "body",
						name: "prizes"
					}
				]
			);
		});

		it("parses array params if arrayType is object", function() {
			assert.deepEqual(
				parser.parseParams({
					body: {
						items: [{
							name: "string",
							tags: [{
								id: "number",
								name: "string"
							}]
						}]
					}
				}),
				[
					{
						type: "array",
						arrayType: {
							type: "object",
							params: [
								{
									type: "string",
									name: "name"
								},
								{
									type: "array",
									arrayType: {
										type: "object",
										params: [
											{
												type: "number",
												name: "id"
											},
											{
												type: "string",
												name: "name"
											}
										]
									},
									name: "tags"
								}
							]
						},
						place: "body",
						name: "items"
					}
				]
			);
		});

		it("parses object params", function() {
			assert.deepEqual(
				parser.parseParams({
					body: {
						profile: {
							fullName: "string",
							picUrls: ["string"],
							collegues: {
								employeeIds: ["number"],
								bossIds: ["number"]
							},
							tags:[
								{
									id: "number",
									name: "string"
								}
							]
						}
					}
				}),
				[
					{
						type: "object",
						params: [
							{
								type: "string",
								name: "fullName"
							},
							{
								type: "array",
								arrayType: "string",
								name: "picUrls"
							},
							{
								type: "object",
								params: [
									{
										type: "array",
										arrayType: "number",
										name: "employeeIds"
									},
									{
										type: "array",
										arrayType: "number",
										name: "bossIds"
									}
								],
								name: "collegues"
							},
							{
								type: "array",
								arrayType: {
									type: "object",
									params: [
										{
											type: "number",
											name: "id"
										},
										{
											type: "string",
											name: "name"
										}
									]
								},
								name: "tags"
							},
						],
						place: "body",
						name: "profile"
					}
				]
			);
		});

	});

});