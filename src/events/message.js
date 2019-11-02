require('dotenv/config');
const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
  client.logger = require("../modules/Logger");

  // If message author is a bot, end execution
  if (message.author.bot) return;
  
  if (message.channel.id === process.env.SUGGESTION_CHAT) {
    message.react('✅');
    message.react('❌');
  }

  // Getting args and command name
  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  // Get command
  const command = client.commands.get(commandName) ||
  client.commands.find(cmd => cmd.cmdInfo.aliases && cmd.cmdInfo.aliases.includes(commandName));
  if (!command) return;
  
  const cmdInfo = command.cmdInfo;

  client.logger.log(`${message.author.username} (${message.author.id}) executed the command: ${cmdInfo.name}`);

  // If command needs a prefix to be executed and the author didn't provide one, end execution
  if (cmdInfo.prefix && !message.content.startsWith(process.env.PREFIX)) return;

  // Check if command is 'server only' (can't be executed inside DMs)
  if (cmdInfo.guildOnly && message.channel.type !== 'text') {
    return message.reply('Este comando só pode ser executado em servidores.');
  }

  // If command needs arguments to be executed, send a error reply message in the chat
  if (cmdInfo.args && !args.length) {
    let reply = (!cmdInfo.reply) ? `Você não especificou nenhum parâmetro, ${message.author}.` : command.reply;

    if (cmdInfo.usage) {
      reply += `\nA maneira de uso correta seria: \`${process.env.PREFIX}${cmdInfo.name} ${cmdInfo.usage}\`.`;
    }

    if (cmdInfo.aliases) {
      reply += `\nAlém de \`${process.env.PREFIX}${cmdInfo.name}\`, você também pode usar: \`${process.env.PREFIX}${cmdInfo.aliases.join(', ')}\`.`;
    }

    return message.channel.send(reply);
  }

  // Cooldown
  if (!cooldowns.has(cmdInfo.name)) {
    cooldowns.set(cmdInfo.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(cmdInfo.name);
  const cooldownAmount = (cmdInfo.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send(`Por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando \`${process.env.PREFIX}${cmdInfo.name}\` novamente ${message.author}.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  
  // Execute command
  try {
    command.execute(client, message, args);
  } catch (error) {
    console.error('[#ERROR]', error);
    message.reply('não foi possível executar este comando!');
  }
}