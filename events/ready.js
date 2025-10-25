const { Events } = require('discord.js');
const readline = require('readline');


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const channel = client.channels.cache.get('1117237431721283696')

		function acceptMessage(){
			rl.question( '', (input) => {
				if (input.length > 0) {
					channel.send(`${input}`)
				}
				acceptMessage();

			})
		}
		acceptMessage();
	},
}