const { Message } = require("discord.js");

const isCommandMessage = (event) => {
	return (
		event instanceof Message &&
		event.content.trimLeft().charAt(0) === '.'
	);
};

const isPrivateMessage = (event) => {
	return event instanceof Message && event.channel.type === 'dm';
};

const isRestrictedCommandMessage = (event) => {
	return event instanceof Message && global.bot.getConfig().getCommandChannels().includes(event.channel.id);
};

const isTextChannelMessage = (event) => {
	return event instanceof Message && event.channel.type === 'text';
}

const ALL = (event) => true;

exports.isCommandMessage = isCommandMessage;
exports.isPrivateMessage = isPrivateMessage;
exports.isRestrictedCommandMessage = isRestrictedCommandMessage;
exports.isTextChannelMessage = isTextChannelMessage;
exports.ALL = ALL;