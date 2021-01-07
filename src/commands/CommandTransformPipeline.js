
const CommandUtils = require('./CommandUtils.js');

const commandTransformPipeline = {
	on: (event) => {
		event.command_content = CommandUtils.splitArgs(event.content);
	}
};

exports.commandTransformPipeline = commandTransformPipeline;