require('dotenv/config');
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	// If message author is a bot, end execution
	if (message.author.bot) return;
	
	// Getting args and command name
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	
	// Get command
	const command = client.commands.get(commandName) 
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	if (!command) return;

	// If command needs a prefix to be executed and the author didn't provide one, end execution
	if (command.prefix && !message.content.startsWith(prefix)) return;

	// Check if command is 'server only' (can't be executed inside DMs)
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('Este comando só pode ser executado em servidores.');
	}

	// If command needs arguments to be executed, send a error reply message in the chat
	if (command.args && !args.length) {
		let reply = (!command.reply) ? `Você não especificou nenhum parâmetro, ${message.author}.` : command.reply;

		if (command.usage) {
			reply += `\nA maneira de uso correta seria: \`${prefix}${command.name} ${command.usage}\`.`;
		}

		if (command.aliases) {
			reply += `\nAlém de \`${prefix}${command.name}\`, você também pode usar: \`${prefix}${command.aliases.join(', ')}\`.`;
		}

		return message.channel.send(reply);
	}

	// Cooldown
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.channel.send(`Por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando \`${prefix}${command.name}\` novamente ${message.author}.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Execute command
	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('não foi possível executar este comando!');
	}
});

client.login(process.env.TOKEN);