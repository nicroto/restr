		{{name}}: function(args, callback) {
			var self = this;{{#if validations}}
{{#each validations}}
			utils.{{#with this}}{{validatorType}}(args.{{argName}}{{/with}});{{/each}}
{{else}}
{{/if}}
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
{{/if}}
			self.parent.makeRequest(
				verb,
				route,
				queryArgs,
				bodyArgs,
				callback
			);
		}