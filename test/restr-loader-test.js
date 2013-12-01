var ExpressAppMock = function() {};
ExpressAppMock.prototype = {
	map: {},

	post: function(route, callback) { this.mapRoute("post", route, callback); },
	get: function(route, callback) { this.mapRoute("get", route, callback); },
	put: function(route, callback) { this.mapRoute("put", route, callback); },
	delete: function(route, callback) { this.mapRoute("delete", route, callback); },
	mapRoute: function(verb, route, callback) {
		this.map[verb + route] = callback;
	}
};

var assert = require("assert"),
	RestrLoader = require('../src/custom-modules/restr-loader.js'),
	badLoader = new RestrLoader(),
	expressApp = new ExpressAppMock(),
	loader = new RestrLoader(expressApp);

var goodServiceSpec = {
	name: "userService",
	methods: [
		{
			route: "/api/user/:id/:otherId?",
			name: "updateUser",
			params: [
				{
					type: "string",
					place: "query",
					name: "name"
				},
				{
					type: "string",
					place: "body",
					name: "description"
				}
			],
			verb: "put",
			logic: function(req, res, id) {
				if ( req && res && id ) {}

				return true;
			}
		}
	]
};

describe('RestrLoader', function() {

	describe('customLoader', function() {

		before(function(done){
			loader = new RestrLoader();
			loader.customLoader = function() { return true; };
			done();
		});

		after(function(done){
			loader = new RestrLoader(expressApp = new ExpressAppMock());
			done();
		});

		it('is used if no expressApp passed on initialization', function() {
			assert.ok(loader.loadService(goodServiceSpec));
		});

	});

	describe('loadServices', function() {

		it('should throw error if no specs are passed (no args)', function() {
			assert.throws( function() {
				loader.loadServices();
			}, Error );
		});

		it('should throw error if no specs are passed (empty array)', function() {
			assert.throws( function() {
				loader.loadServices([]);
			}, Error );
		});

	});

	describe('loadService', function() {

		afterEach(function(done){
			loader = new RestrLoader(expressApp = new ExpressAppMock());
			done();
		});

		it('should throw error if no loader available (not expressApp, nor customLoader is set)', function() {
			assert.throws( function() {
				badLoader.loadService(goodServiceSpec);
			}, Error );
		});

		it('should register new API method when data is correct)', function() {
			loader.loadService(goodServiceSpec);
			var methodSpec = goodServiceSpec.methods[0];
			var funcName = methodSpec.verb + methodSpec.route;
			assert.ok(expressApp.map[funcName](), "funcName = " + funcName + "\n" + JSON.stringify(expressApp));
		});

	});

});