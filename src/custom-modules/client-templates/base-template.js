;(function() {

{{utils}}

function ServerAPI(conf) {
	var self = this;{{#each serviceNames}}
	self.{{this}}.parent = self;{{/each}}

	self.root = conf.root ? conf.root : "";
	self.makeRequest = conf.makeRequest;
}

ServerAPI.prototype = {

	root: "",
	makeRequest: null,
{{#each services}}
{{#with this}}{{service}}{{delimiter}}{{/with}}
{{/each}}
};

if (typeof exports === "object") {
	module.exports = ServerAPI;
} else if (typeof define == "function" && define.amd) {
	define(function(){ return ServerAPI; });
} else {
	window.ServerAPI = ServerAPI;
}

})();