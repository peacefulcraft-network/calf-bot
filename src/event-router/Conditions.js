const { Message } = require("discord.js");

const isCommandMessage = (event) => {
	return (
		event instanceof Message &&
		// global.bot.getConfig().getCommandChannels().includes(event.channel.id) &&
		event.content.trim().charAt(0) === '.'
	);
}

const isPrivateMessage = (event) => {
	return event instanceof Message && event.channel.type === 'dm';
}

const isTextChannelMessage = (event) => {
	return event instanceof Message && event.channel.type === 'text';
}

const monitor = (event) => true;

exports.isCommandMessage = isCommandMessage;
exports.isPrivateMessage = isPrivateMessage;
exports.isTextChannelMessage = isTextChannelMessage;
exports.monitor = monitor;