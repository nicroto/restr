'use strict';

var fs = require("fs"),
	Handlebars = require("handlebars"),
	XmlEntities = require('html-entities').XmlEntities,
	entities = new XmlEntities(),
	express = require("express"),
	validator = require("./restr-spec-validator"),
	parser = require("./restr-param-parser"),
	RestrLoader = require("./restr-loader");


var ClientGenerator = function() {
	var self = this;

	self.baseTemplate = Handlebars.compile(
		fs.readFileSync(__dirname + "/client-templates/base-template.js").toString()
	);
	self.utilsTemplate = Handlebars.compile(
		fs.readFileSync(__dirname + "/client-templates/utils-template.js").toString()
	);
	self.serviceTemplate = Handlebars.compile(
		fs.readFileSync(__dirname + "/client-templates/service-template.js").toString()
	);
	self.methodTemplate = Handlebars.compile(
		fs.readFileSync(__dirname + "/client-templates/method-template.js").toString()
	);
};

ClientGenerator.prototype = {

	baseTemplate: null,
	utilsTemplate: null,
	serviceTemplate: null,
	methodTemplate: null,

	render: function(specs) {
		var self = this;

		var baseModel = {
			utils: self.utilsTemplate,

			services: [
				/*{
					service: "userService: {...",
					delimiter: ","
				}*/
			],
			serviceNames: [
				/*"userService"*/
			]
		};
		for ( var i = 0; i < specs.length; i++ ) {
			var spec = specs[i],
				serviceName = spec.name,
				serviceRendering = self.renderService(spec),
				delimiter = ( (i + 1) === specs.length ) ? "" : ",";

			baseModel.serviceNames.push( serviceName );
			baseModel.services.push({
				service: serviceRendering,
				delimiter: delimiter
			} );
		}

		return entities.decode( self.baseTemplate(baseModel) ).replace(/&quot;/g, "\"");
	},

	renderService: function(spec) {
		var self = this,
			serviceModel = {
				serviceName: spec.name,
				methods: [
					/*{
						method: "updateUser: function(args, callback)...",
						delimiter: ","
					}*/
				]
			},
			methodSpecs = spec.methods,
			expressApp = express(),
			loader = new RestrLoader(expressApp);

			// validation
			validator.validateServiceSpec(spec);

			// after this expressApp.routes will hold the keys for the url
			// !!! Ugly !!!
			loader.loadService(spec);

		for ( var i = 0; i < methodSpecs.length; i++ ) {
			var methodSpec = methodSpecs[i];
			var methodRendering = self.renderMethod(methodSpec, expressApp.routes[methodSpec.verb]);
			var delimiter = ( (i + 1) === methodSpecs.length ) ? "" : ",";
			serviceModel.methods.push({
				method: methodRendering,
				delimiter: delimiter
			} );
		}

		return self.serviceTemplate(serviceModel);
	},

	renderMethod: function(spec, routes) {
		var self = this,
			methodModel = {
				name: spec.name,
				verb: spec.verb,
				route: spec.route,
				validations: [
					/*{
						validatorType: "validateStringArgument",
						argName: "name"
					}*/
				],
				arrayValidations: [
					/*{
						argName: "tags",
						arrayType: "string"
					}*/
				],
				arrayClones: [
					/*{
						argName: "tags"
					}*/
				],
				objects: [
					/*"profile.collegues"*/
				],
				urlKeys: [
					/*"id"*/
				],
				optionalUrlKeys: [
					/*"otherId"*/
				],
				queryArgs: [
					/*"name"*/
				],
				queryArrays: [
					/*"ids"*/
				],
				bodyArgs: [
					/*"description"*/
				],
				bodyArrays: [
					/*"ids"*/
				]
			},
			params = parser.parseParams(spec.params);

		var extractModelParam = function(param, path) {
			path = self._combineParamPaths( path, param.name );
			if ( param.type === "array" ) {
				var type = param.arrayType;
				if ( typeof(type) === "object" ) {
					type = "object";
				}
				methodModel.arrayValidations.push( {
					argName: path,
					arrayType: type
				} );
			} else if ( param.type === "object" ) {
				if ( path === param.name ) {
					methodModel.objects.push( path );
				}
				var innerParams = param.params;
				for ( var i = 0; i < innerParams.length; i++ ) {
					extractModelParam( innerParams[i], path );
				}
			} else {
				methodModel.validations.push( {
					validatorType: "validate" + param.type[0].toUpperCase() + param.type.slice(1) + "Argument",
					argName: path
				} );
			}
		};

		for ( var i = 0; i < params.length; i++ ) {
			var param = params[i];
			extractModelParam(param);
			if ( param.type !== "object" ) {
				var place;
				switch (param.place) {
					case "query":
						place = (param.type === "array") ? "queryArrays" : "queryArgs";
						methodModel[place].push( param.name );
						break;
					case "body":
						place = (param.type === "array") ? "bodyArrays" : "bodyArgs";
						methodModel[place].push( param.name );
						break;
				}
			}
		}

		var urlKeys;
		for ( i = 0; i < routes.length; i++ ) {
			if ( routes[i].path === spec.route ) {
				urlKeys = routes[i].keys;
				break;
			}
		}

		for ( i = 0; i < urlKeys.length; i++ ) {
			var key = urlKeys[i];
			if ( key.optional ) {
				methodModel.optionalUrlKeys.push( key.name );
			} else {
				methodModel.urlKeys.push( key.name );
			}
		}

		return self.methodTemplate(methodModel);
	},

	_combineParamPaths: function(basePath, endPath) {
		if ( !basePath ) {
			return endPath;
		} else {
			return basePath + "." + endPath;
		}
	}

};

module.exports = ClientGenerator;