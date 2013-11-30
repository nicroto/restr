var fs = require("fs");

eval(
	fs.readFileSync(__dirname + "/client-templates/utils-template.js").toString()
);

module.exports = utils;