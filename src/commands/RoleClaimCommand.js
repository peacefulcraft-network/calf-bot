const discord = require('discord.js');

const EventConditions = require('../event-router/Conditions.js');
const EventRouter = require('../event-router/EventRouter.js');

const addClaimableRole = {
	if: (event) => {
		return (
			event.command_content[1] === 'add' &&
			EventConditions.isRestrictedCommandMessage(event) &&
			EventConditions.isTextChannelMessage(event)
		);
	},

	on: (event) => {
		if (event.command_content[2] === undefined || event.command_content[3] === undefined) {
			event.channel.send('Please include the claim name, the role id, and the claim description.');
			return;
		}

		if (global.bot.getConfig().getClaimableRoleByClaimName(event.command_content[2]) != undefined) {
			event.channel.send('A role claim with name `' + event.command_content[2] + '` already exists.');
			return;
		}

		if (event.command_content[4] === undefined) {
			event.channel.send('Please include the claim name, the role id, and the claim description.');
			return;
		}

		try {
			global.bot.getConfig().addClaimableRole({
				claim_name: event.command_content[2],
				claim_description: event.command_content[4],
				role_id: event.command_content[3],
			});
			event.channel.send('Claim sucesfully created.');
		} catch (e) {
			event.channel.send(`\`\`\`${e.toString()}\`\`\``);
			event.channel.send('An error occured while trying to save this claim pair.');
			console.log(e);
		}
	}
};

const listClaimableRole = {
	if: (event) => {
		return event.command_content[1] === 'list';
	},

	on: (event) => {
		if (EventConditions.isRestrictedCommandMessage(event)) {
			// This has to be like this or else the Discord formatting breaks
			event.channel.send(`\`\`\`json
${JSON.stringify(global.bot.getConfig().getClaimableRoles())}
\`\`\``);
		}

		const embed = new discord.MessageEmbed();
		embed.setTitle('Role Claim Help');
		embed.setDescription('I can grant you the following magic powers:');

		const roles = global.bot.getConfig().getClaimableRoles();
		for(let i=0; i<roles.length; i++) {
			embed.addFields({
				name: `.r claim ${roles[i].claim_name}`,
				value: roles[i].claim_description, 
			})
		}

		event.channel.send(embed);
	}
};

const deleteClaimableRole = {
	if: (event) => {
		return (
			event.command_content[1] === 'delete' &&
			EventConditions.isRestrictedCommandMessage(event) &&
			EventConditions.isTextChannelMessage(event)
		);
	},

	on: (event) => {
		const roleClaimConfig = global.bot.getConfig().getClaimableRoleByClaimName(event.command_content[2]);
		if (roleClaimConfig === undefined) {
			event.channel.send('Sorry, I am not aware of that role.');
		} else {
			try {
				global.bot.getConfig().removeClaimableRoleByClaimName(event.command_content[2]);
				event.channel.send('Claim sucesfully deleted.');
			} catch (e) {
				event.channel.send(`\`\`\`${e.toString()}\`\`\``);
				event.channel.send('An error occured while trying to delete this claim.');
				console.log(e);
			}
		}
	}
};

const claimClaimableRole = {
	if: (event) => {
		return (
			event.command_content[1] === 'claim' &&
			EventConditions.isRestrictedCommandMessage(event) &&
			EventConditions.isTextChannelMessage(event)
		);
	},

	on: (event) => {
		const roleClaimConfig = global.bot.getConfig().getClaimableRoleByClaimName(event.command_content[2]);
		if (roleClaimConfig === undefined) {
			event.channel.send('Sorry, I am not aware of that role.');
		} else {
			const claimedRoleId = roleClaimConfig.role_id;
			const claimedRole = event.guild.roles.cache.get(claimedRoleId);
			event.member.roles.add(claimedRole)
				.then(() => {
					event.channel.send('You\'ve been granted the `' + roleClaimConfig.claim_name + '` role.');
				})
				.catch((error) => {
					console.log(error);
					event.channel.send('Sorry, I can\'t contact Discord right now :slight_frown:. You can try again, or report this to a staff member if the issue is not resolved in a few minutes.')
				});
		}
	}
};

const unclaimClaimableRole = {
	if: (event) => {
		return (
			event.command_content[1] === 'unclaim' &&
			EventConditions.isRestrictedCommandMessage(event) &&
			EventConditions.isTextChannelMessage(event)
		);
	},

	on: (event) => {
		const roleClaimConfig = global.bot.getConfig().getClaimableRoleByClaimName(event.command_content[2]);
		if (roleClaimConfig === undefined) {
			event.channel.send('Sorry, I am not aware of that role.');
		} else {
			const claimedRoleId = roleClaimConfig.role_id;
			const claimedRole = event.guild.roles.cache.get(claimedRoleId);
			event.member.roles.remove(claimedRole)
				.then(() => {
					event.channel.send('You\'ve been removed from the `' + roleClaimConfig.claim_name + '` role group.');
				})
				.catch((error) => {
					console.log(error);
					event.channel.send('Sorry, I can\'t contact Discord right now :slight_frown:. You can try again, or report this to a staff member if the issue is not resolved in a few minutes.')
				});
		}
	}
};

const RoleClaimCommand = new EventRouter();
RoleClaimCommand.if = (event) => {
	return event.command_content[0] === '.r';
};

RoleClaimCommand.addRouteModule(addClaimableRole);
RoleClaimCommand.addRouteModule(deleteClaimableRole);
RoleClaimCommand.addRouteModule(listClaimableRole);
RoleClaimCommand.addRouteModule(claimClaimableRole);
RoleClaimCommand.addRouteModule(unclaimClaimableRole);

module.exports = RoleClaimCommand;