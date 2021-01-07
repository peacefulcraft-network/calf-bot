const PingCommand = {
	if: (event) => {
		return event.content === '.ping';
	},
	
	on: (event) => {
		event.channel.send(':cow: moo.');
	}
}

module.exports = PingCommand;