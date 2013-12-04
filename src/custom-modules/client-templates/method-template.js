		{{name}}: function(args, callback) {
			var self = this;
{{#each validations}}
			utils.{{#with this}}{{validatorType}}(args.{{argName}}{{/with}});{{/each}}{{#if arrayValidations}}{{#each arrayValidations}}
			utils.validateArrayArgument({{#with this}}args.{{argName}}, "{{arrayType}}"{{/with}});{{/each}}
{{/if}}{{#if validations}}{{#unless arrayValidations}}
{{/unless}}{{/if}}
			var route = utils.combinePaths(
					self.parent.root,
					"{{route}}"{{#each urlKeys}}
						.replace(":{{this}}", args.{{this}}){{/each}}{{#each optionalUrlKeys}}
						.replace(":{{this}}?", args.{{this}} ? args.{{this}} : ""){{/each}}
				),
				queryArgs = {},
				bodyArgs = {},
				verb = "{{verb}}";
{{#each queryArgs}}
			queryArgs.{{this}} = args.{{this}};{{/each}}{{#if bodyArgs}}{{#each bodyArgs}}
			bodyArgs.{{this}} = args.{{this}};{{/each}}
{{/if}}{{#if queryArgs}}{{#unless bodyArgs}}
{{/unless}}{{/if}}
			self.parent.makeRequest(
				verb,
				route,
				queryArgs,
				bodyArgs,
				callback
			);
		}