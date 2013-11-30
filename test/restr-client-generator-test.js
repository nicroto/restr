var assert = require("assert"),
	fs = require("fs"),
	ClientGenerator = require("../src/custom-modules/restr-client-generator.js"),
	generator = new ClientGenerator();

describe("ClientGenerator", function() {

	describe("renderService", function() {

		it("should render a single service, single method API", function() {
			var specs = require("./test-cases/1-client-rendering.data");
			var expectedRendering = fs.readFileSync(__dirname + "/test-cases/1-client-rendering.result").toString();
			var result = generator.render(specs);
			assert.equal(result, expectedRendering);
		});

		it("should render a single service, multiple methods API", function() {
			var specs = require("./test-cases/2-client-rendering.data");
			var expectedRendering = fs.readFileSync(__dirname + "/test-cases/2-client-rendering.result").toString();
			var result = generator.render(specs);
			assert.equal(result, expectedRendering);
		});

		it("should render a multiple services, multiple methods API", function() {
			var specs = require("./test-cases/3-client-rendering.data");
			var expectedRendering = fs.readFileSync(__dirname + "/test-cases/3-client-rendering.result").toString();
			var result = generator.render(specs);
			assert.equal(result, expectedRendering);
		});

	});

});