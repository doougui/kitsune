require('dotenv/config');
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

const init = () => {
	// Load command files
	commandFiles.forEach(file => {
		const command = require(`./commands/${file}`);
		const commandName = file.split(".")[0];

		client.commands.set(commandName, command);
	})

	// Load event files
	eventFiles.forEach(file => {
		const eventName = file.split('.')[0];
		const event = require(`./events/${file}`);

		client.on(eventName, event.bind(null, client));
	});

	const getChannel = (member) => {
		const channel = member.guild.channels.find(ch => ch.id === process.env.WELCOME_CHAT);
		if (!channel) return;

		return channel;
	}

	const updateTopic = (member, channel) => {
		const emoji = [':zero:', ':one', ':two', ':three:', ':four:', ':five:', ':six:', ':seven', ':eight', ':nine'];
		const qtMembers = member.guild.memberCount;
		let emojiNum = '';

		for (num of qtMembers.toString()) {
			emojiNum += emoji[num];
		}

		channel.edit({
			topic: `Atualmente há ${emojiNum} membros no servidor.`
		});
	}

	client.once('ready', () => {
		console.log('[#LOG]', `Bot\'s ready. Running with ${client.users.size - 1} user${((client.users.size - 1) > 1) ? 's' : ''} in ${client.guilds.size} server${(client.guilds.size > 1) ? 's' : ''}.`);
	});

	client.on('guildMemberAdd', member => {
		const channel = getChannel(member);
		channel.send(`Bem-vindo ao servidor, ${member}.`);

		updateTopic(member, channel);
	});

	client.on('guildMemberRemove', member => {
		const channel = getChannel(member);
		channel.send(`${member} saiu do servidor.`);

		updateTopic(member, channel);
	});

	client.login(process.env.TOKEN);
}

init();