if (Number(process.version.slice(1).split('.')[0]) < 8) {
  throw new Error(
    'Node 8.0.0 or higher is required. Update Node on your system.'
  );
}

require('dotenv').config({
  path: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.env'
});

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.logger = require('./modules/Logger');

const init = () => {
  // Load command files
  const commandFiles = fs
    .readdirSync('./src/commands')
    .filter(file => file.endsWith('.js') && !file.startsWith('_'));

  client.logger.log(`Loading a total of ${commandFiles.length} commands.`);
  commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    const commandName = file.split('.')[0];

    client.commands.set(commandName, command);
  });

  // Load event files
  const eventFiles = fs
    .readdirSync('./src/events')
    .filter(file => file.endsWith('.js'));

  client.logger.log(`Loading a total of ${eventFiles.length} events.`);
  eventFiles.forEach(file => {
    const eventName = file.split('.')[0];
    const event = require(`./events/${file}`);

    client.on(eventName, event.bind(null, client));
  });

  client.login(process.env.TOKEN);
};

init();
