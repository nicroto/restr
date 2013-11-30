;(function() {

{{utils}}

function serverAPI(conf) {
	var self = this;{{#each serviceNames}}
	self.{{this}}.parent = self;{{/each}}

	self.root = conf.root ? conf.root : "";
	self.makeRequest = conf.makeRequest;
}

serverAPI.prototype = {

	root: "",
	makeRequest: null,
{{#each services}}
{{#with this}}{{service}}{{delimiter}}{{/with}}
{{/each}}
};

if (typeof exports === "object") {
	module.exports = serverAPI;
} else if (typeof define == "function" && define.amd) {
	define(function(){ return serverAPI; });
} else {
	window.serverAPI = serverAPI;
}

})();