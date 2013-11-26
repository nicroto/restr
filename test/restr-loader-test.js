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
	customLoader = function() { return true; },
	RestrLoader = require('../src/custom-modules/restr-loader.js'),
	badLoader = new RestrLoader(),
	expressApp = new ExpressAppMock(),
	loader = new RestrLoader(expressApp);

var goodServiceSpec = {
	methods: [
		{
			route: "/api/user",
			name: "getUser",
			params: [
				{
					type: "String",
					name: "fbID"
				}
			],
			verb: "get",
			logic: function(fbID) {
				if ( fbID ) {}

				return true;
			}
		}
	]
};

describe('RestrLoader', function() {

	describe('customLoader', function() {

		before(function(done){
			loader = new RestrLoader();
			loader.customLoader = customLoader;
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

		it('should throw error if no spec is passed', function() {
			assert.throws( function() {
				loader.loadService();
			}, Error );
		});

		it('should throw error if no methods are specified (no prop)', function() {
			assert.throws( function() {
				loader.loadService({});
			}, Error );
		});

		it('should throw error if no methods are specified (null prop)', function() {
			assert.throws( function() {
				loader.loadService({ methods: null });
			}, Error );
		});

		it('should throw error if no methods are specified (empty array)', function() {
			assert.throws( function() {
				loader.loadService({ methods: [] });
			}, Error );
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

	describe('validateRoot', function() {

		it('should throw error if non-string passed', function() {
			assert.throws( function() {
				loader.validateRoot({});
			}, Error );
		});

	});

	describe('validateName', function() {

		it('should throw error if it has spaces', function() {
			assert.throws( function() {
				loader.validateName(" name");
			}, Error );
		});

		it('should throw error if starting with number', function() {
			assert.throws( function() {
				loader.validateName("1name");
			}, Error );
		});

		it('should throw error if contains non-allowed symbols', function() {
			assert.throws( function() {
				loader.validateName("#name");
			}, Error );
			assert.throws( function() {
				loader.validateName("name.");
			}, Error );
			assert.throws( function() {
				loader.validateName("+name");
			}, Error );
			assert.throws( function() {
				loader.validateName("name&");
			}, Error );
		});

		it('should not throw an error if valid name', function() {
			loader.validateName("name");
			loader.validateName("name$");
			loader.validateName("$name");
			loader.validateName("$elABcd123");
		});

	});

	describe('validateVerb', function() {

		it('should throw error if unknown verb is used', function() {
			assert.throws( function() {
				loader.validateVerb("remove");
			}, Error );
		});

		it('should not throw error if known verb is used', function() {
			loader.validateVerb("get");
			loader.validateVerb("post");
			loader.validateVerb("put");
			loader.validateVerb("delete");
		});

	});

	describe('validateLogic', function() {

		it('should throw error if no argument passed', function() {
			assert.throws( function() {
				loader.validateLogic();
			}, Error );
		});

		it('should throw error if object is passed', function() {
			assert.throws( function() {
				loader.validateLogic({});
			}, Error );
		});

		it('should not throw error if function is passed', function() {
			loader.validateLogic(function() {});
		});

	});

});