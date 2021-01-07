const Discord = require('discord.js');

const Configuration = require('./config/Configuration.js');
const EventRouter = require('./event-router/EventRouter.js');
const EventConditions = require('./event-router/Conditions.js');

const PingCommand = require('./commands/PingCommand.js');

class CalfBot {
	getConfig() { return this.config; }

	constructor() {
		// Load configuration file
		try {
			this.config = new Configuration(__dirname + '/../../bot_config.yml');
		} catch (e) {
			console.log(e);
		}

		// Initialize Discord Bot
		this.discord = new Discord.Client();
		this.discord.once('ready', () => {
			console.log('Connected to Discord Gateawy.');
			console.log(`Join Link: ${this.generateJoinLink()}`);
		});

		const MessageRouter = new EventRouter();
		const CommandMessageRouter = new EventRouter();
		const TextMessageRouter = new EventRouter();
		const PrivateMessageRouter = new EventRouter();
		const TextChannelMessageRouter = new EventRouter();

		// Commands & Non-command routers
		MessageRouter.addRoute(EventConditions.isCommandMessage, CommandMessageRouter);
		MessageRouter.addRoute(() => !EventConditions.isCommandMessage, TextMessageRouter);

		// Command routes
		CommandMessageRouter.addRoute(EventConditions.monitor, { on: (message) => { console.log(`CCM ${message.content}`); } })
		CommandMessageRouter.addRouteModule(PingCommand);
		
		// Public & public message routers
		TextMessageRouter.addRoute(EventConditions.isPrivateMessage, PrivateMessageRouter);
		TextMessageRouter.addRoute(EventConditions.isTextChannelMessage, TextChannelMessageRouter);

		// Text message routes
		PrivateMessageRouter.addRoute(EventConditions.monitor, { on: (message) => { console.log(message.content); } })
		TextChannelMessageRouter.addRoute(EventConditions.monitor, { on: (message) => { console.log(message.content); } })
		this.discord.on('message', (message) => MessageRouter.on(message));

		this.discord.login(this.config.getDiscordToken());
	}

	generateJoinLink() {
		return `https://discord.com/oauth2/authorize?client_id=${this.config.getDiscordClientId()}&permissions=268921920&scope=bot`;
	}
}

module.exports = CalfBot;