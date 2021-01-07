const yaml = require('js-yaml');
const fs   = require('fs');

class Configuration {
	getDiscordClientId() { return this.config.discord_client_id; }	
	getDiscordToken() { return this.config.discord_token; }

	getCommandChannels() { return this.config.discord_command_channels; }
	
	getClaimableRoles() { return this.config.discord_claimable_roles; }
	getClaimableRoleById(roleId) {
		const claimableRoles = this.config.discord_claimable_roles;
		for(let i=0; i<claimableRoles.length; i++) {
			if (claimableRoles[i].roleId === roleId) {
				return this.config.discord_claimable_roles[i];
			}
		}
	}
	getClaimableRoleByClaimName(claimName) {
		const claimableRoles = this.config.discord_claimable_roles;
		for(let i=0; i<claimableRoles.length; i++) {
			if (claimableRoles[i].claim_name == claimName) {
				return this.config.discord_claimable_roles[i];
			}
		}
	}
	addClaimableRole(roleObj) {
		this.config.discord_claimable_roles.push(roleObj);
		this.writeConfigFile();
	}
	removeClaimableRoleByClaimName(claimName) {
		const claimableRoles = this.config.discord_claimable_roles;
		for(let i=0; i<claimableRoles.length; i++) {
			if (claimableRoles[i].claim_name == claimName) {
				this.config.discord_claimable_roles.splice(i, 1);
				this.writeConfigFile();
				break;
			}
		}
	}
	removeClaimableRoleById(roleId) {
		const claimableRoles = this.config.discord_claimable_roles;
		for(let i=0; i<claimableRoles.length; i++) {
			if (claimableRoles[i].role_id === roleId) {
				this.config.discord_claimable_roles.splice(i, 1);
				this.writeConfigFile();
				break;
			}
		}
	}

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

	writeConfigFile() {
		try {
			const config = yaml.dump(this.config);
			fs.writeFileSync(this.configFilePath, config, 'utf8');
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
};

module.exports = Configuration;