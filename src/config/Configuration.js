const yaml = require('js-yaml');
const fs   = require('fs');

class Configuration {
	getDiscordClientId() { return this.config.discord_client_id; }	
	getDiscordToken() { return this.config.discord_token; }

	getCommandChannels() { return this.config.discord_command_channels; }

	constructor(configFilePath) {
		this.configFilePath = configFilePath;
		
		if (!this.loadConfigFile()) {
			throw new Error('Unable to load configuration file ' + this.configFilePath, 'utf8');
		}
	}

	loadConfigFile() {
		try {
			this.config = yaml.load(fs.readFileSync(this.configFilePath));
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
};

module.exports = Configuration;