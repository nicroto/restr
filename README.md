# Restr [![Build Status](https://secure.travis-ci.org/nicroto/restr.png?branch=master)](http://travis-ci.org/nicroto/restr)

Restr is a tool significantly simplifying the development of your server (REST) API with Node.js.
It's a combination of:

 - a standard for writing server (REST) API specs ([Restr Service Specification / Restr Spec](#restr-service-specification));
 - [node module](#running-all-specs-on-the-server) for loading the specs of your API on the server (using ExpressJS by default, but configurable to alternatives);
 - a CLI tooling for [API spec validation](#validating-written-specs) and **[auto-generation of a client JavaScript lib](#generating-the-client-lib) for accessing your server API**.

Restr requires your REST API to be written in accordance to the Restr Spec. Still in its infancy, this specification aims at adding as little overhead as possible, while enabling features, such as the auto-generation of client lib for accessing your server API and validation of transferred data.

Having all services written using the Restr Spec, you can use the CLI tool restr to **validate** these specs and **generate the client-side JavaScript code**, which usually is done manually as you add, change or remove methods and whole service to/in/from the server API. The generated lib validates all passed data in accordance with the spec it was generated from.

This simplifies significantly your workflow to **working on the server API** -> **regenerate the client code** -> **repeat**.

## Getting Started

Restr is not yet on npm (it should get some testing before publishing). You can install it as a CLI tool by first cloning the repo [https://github.com/nicroto/restr](https://github.com/nicroto/restr) and then install it as a global from its dir.

```bash
$ git clone https://github.com/nicroto/restr
$ cd restr
$ npm install -g .
```

Run restr using:

```bash
$ restr --help
Usage:
	restr --validate <filePath> [<filePath> ... <filePath>]
	restr --generate <filePath> [<filePath> ... <filePath>] --dest <destFilePath>

Options:
  --validate  Validate (show errors) in Restr service specs.
  --generate  Generate client-side API.                     
  --dest [default: "restr-generated-client-api.js"]
```

## Usage

### Restr Service Specification

Here is a sample specification of userService having 2 methods (getUser and updateUser):

```javascript
var spec = {
	name: "userService",
	methods: [
		{
			route: "/api/user/:id",
			name: "getUser",
			params: [],
			verb: "get",
			logic: function(req, res, id) {
				// The action triggered on the specified route hit
			}
		},
		{
			route: "/api/user/:id/:otherId?",
			name: "updateUser",
			params: [
				{
					type: "string", /* used for validation (so far only number and string are supported) */
					place: "query", /* specifies where will the param reside (body or query) in the request */
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
				// The action triggered on the specified route hit
			}
		}
	]
};

module.exports = spec;
```

### Running all specs on the server

In this file structure:

```
server/
├── rest/
│   ├── user-service-spec.js
│   ├── data-service-spec.js
└── app.js
```

By default, Restr uses ExpressJS for routing. Here is how app.js should load the services:

```javascript
/* app.js */

'use strict';

var express = require("express"),
	RestrLoader = require("restr").RestrLoader,
	app = express(),
	loader = new RestrLoader(app);

loader.loadServices( [
	require("./rest/user-service-spec"),
	require("./rest/data-service-spec")
] );
```

In case you would like to use alternative routing mechanism (to ExpressJS), you can do so like this:

```javascript
/* app.js */

'use strict';

var RestrLoader = require("restr").RestrLoader,
	loader = new RestrLoader();

loader.customLoader = function(serviceSelf, name, route, verb, logic) {
	// sample implementation
	var finalFunc = serviceSelf[name] = function() {
		return logic.apply(serviceSelf, arguments);
	};
	customRouter.handleRoute(route, verb, finalFunc);
}

loader.loadServices( [
	require("./rest/user-service-spec"),
	require("./rest/data-service-spec")
] );
```

### Validating written specs

Once you have written your spec(s), you can validate them with the restr CLI tooling:

```bash
$ restr --validate rest/user-service-spec.js rest/data-service.js
```

If there are errors, there will be (or at least "should be" - report!) an error stack and appropriate message to assist you in resolving the problem.

### Generating the client lib

The biggest benefit of using Restr is that you can simply generate the client library accessing your server API, instead of manually writing the client code. Also, there shouldn't be any tests for this API (you can write some, but they should be irrelevant, because the generation process is already tested).

Here is how you generate the client API lib on the sample we saw above

```bash
$ restr --generate rest/user-service-spec.js rest/data-service-spec.js --dest path/to/client/rest-api-client.js
```

Validation is automatically being performed in the process of generation, so if there is something invalid in the spec, nothing will be produced and you should be able to see error pointing you to the validation issue.

restr would be an awesome tool to include in the build process of your project (automatically placing the client in the client app's source).

### The auto-generated client lib

Here is (approximately) how would look the client lib for the userService (the spec shown earlier):

```javascript
;(function() {

var utils = {

	validateStringArgument: function(arg) {
		if ( typeof(arg) !== "string" ) {
			throw new Error("argument is not a string.");
		}
	},

	validateNumberArgument: function(arg) {
		if ( typeof(arg) !== "number" ) {
			throw new Error("argument is not a number.");
		}
	},
	...
};

function ServerAPI(conf) {
	var self = this;
	self.userService.parent = self;

	self.root = conf.root ? conf.root : "";
	self.makeRequest = conf.makeRequest;
}

ServerAPI.prototype = {

	root: "",
	makeRequest: null,

	userService: {

		parent: null,

		getUser: function(args, callback) {
			var self = this;

			var route = utils.combinePaths(
					self.parent.root,
					"/api/user/:id"
						.replace(":id", args.id)
				),
				queryArgs = {},
				bodyArgs = {},
				verb = "get";

			self.parent.makeRequest(
				verb,
				route,
				queryArgs,
				bodyArgs,
				callback
			);
		},

		updateUser: function(args, callback) {
			var self = this;

			utils.validateStringArgument(args.name);
			utils.validateStringArgument(args.description);

			var route = utils.combinePaths(
					self.parent.root,
					"/api/user/:id/:otherId?"
						.replace(":id", args.id)
						.replace(":otherId?", args.otherId ? args.otherId : "")
				),
				queryArgs = {},
				bodyArgs = {},
				verb = "put";

			queryArgs.name = args.name;
			bodyArgs.description = args.description;

			self.parent.makeRequest(
				verb,
				route,
				queryArgs,
				bodyArgs,
				callback
			);
		}

	}

};

if (typeof exports === "object") {
	module.exports = ServerAPI;
} else if (typeof define == "function" && define.amd) {
	define(function(){ return ServerAPI; });
} else {
	window.ServerAPI = ServerAPI;
}

})();
```

### Using the generated lib

You can use the generated script in 3 different ways:

 - You can add it to a page with a script tag. Then a global var **ServerAPI** will be created.

```html
<script type="text/javascript" src="rest-api-client.js"></script>
<!-- ... -->
<script type="text/javascript">
	var server = new ServerAPI( {
		root: "/",/* Server's address */
		makeRequest: function(verb, route, queryArgs, bodyArgs, callback) {
			// using superagent
			request
				.[verb](route)
				.send(bodyArgs)
				.query(queryArgs)
				.end(function(res){
					callback(res);
				});
		}
	} );
</script>
```

 - You can require it in a nodejs app

```javascript
/* Node app connecting to your REST API */

'use strict';

var ServerAPI = require("./rest-api-client"),
	request = require("superagent");

var server = new ServerAPI( {
	root: "http://example.com/", /* Server's address */
	makeRequest: function(verb, route, queryArgs, bodyArgs, callback) {
		request
			.[verb](route)
			.send(bodyArgs)
			.query(queryArgs)
			.end(function(res){
				callback(res);
			});
	}
} );
```

 - You can require it in web app using RequireJS:

```javascript
/* RequireJS's 'require' is different from the one in NodeJS */

define( ["superagent", "rest-api-client"], function(request, ServerAPI) {

	'use strict';

	var ServerAPI = require("./rest-api-client"),
		request = require("superagent");

	var server = new ServerAPI( {
		root: "http://example.com/", /* Server's address */
		makeRequest: function(verb, route, queryArgs, bodyArgs, callback) {
			request
				.[verb](route)
				.send(bodyArgs)
				.query(queryArgs)
				.end(function(res){
					callback(res);
				});
		}
	} );
} );
```

## Not yet implemented
 - Restr Spec parameters:
	- Array
	- Object
 - **I'm open for (reasonable) suggestions**

## Release History
*Not released yet*

Planned Release Date: **10th of January 2014**

## License
Copyright (c) 2013 Nikolay Tsenkov  
Licensed under the MIT license.