	{{serviceName}}: {

		parent: null,
{{#each methods}}
{{#with this}}{{method}}{{delimiter}}{{/with}}
{{/each}}
	}