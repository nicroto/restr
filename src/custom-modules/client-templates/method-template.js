		{{name}}: function(args, callback) {
			var self = this;{{#if objects}}
{{#each objects}}
			utils.validateObjectArgument(args.{{this}});{{/each}}{{/if}}{{#if validations}}
{{#each validations}}
			utils.{{#with this}}{{validatorType}}(args.{{argName}}{{/with}});{{/each}}{{/if}}{{#if arrayValidations}}
{{#each arrayValidations}}
			utils.validateArrayArgument({{#with this}}args.{{argName}}, "{{arrayType}}"{{/with}});{{/each}}{{/if}}

			var route = utils.combinePaths(
					self.parent.root,
					"{{route}}"{{#each urlKeys}}
						.replace(":{{this}}", args.{{this}}){{/each}}{{#each optionalUrlKeys}}
						.replace(":{{this}}?", args.{{this}} ? args.{{this}} : ""){{/each}}
				),
				queryArgs = {},
				bodyArgs = {},
				verb = "{{verb}}";{{#if queryArgs}}
{{#each queryArgs}}
			queryArgs.{{this}} = args.{{this}};{{/each}}{{/if}}{{#if bodyArgs}}
{{#each bodyArgs}}
			bodyArgs.{{this}} = args.{{this}};{{/each}}{{/if}}{{#if queryArrays}}
{{#each queryArrays}}
			queryArgs.{{this}} = utils.cloneArray(args.{{this}});{{/each}}{{/if}}{{#if bodyArrays}}
{{#each bodyArrays}}
			bodyArgs.{{this}} = utils.cloneArray(args.{{this}});{{/each}}{{/if}}{{#if objects}}
{{#each objects}}
			bodyArgs.{{this}} = utils.cloneObject(args.{{this}});{{/each}}{{/if}}

			self.parent.makeRequest(
				verb,
				route,
				queryArgs,
				bodyArgs,
				callback
			);
		}