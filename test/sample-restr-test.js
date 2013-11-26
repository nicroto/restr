var assert = require("assert");
var restr = require('../src/custom-modules/sample-restr-module.js');

describe('restr', function(){
	describe('awesome()', function(){
		it('should be awesome', function(){
			assert.equal('awesome', restr.awesome());
		});
	});
});