const Discord = require('discord.js');
const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
  // If message author is a bot, end execution
  if (message.author.bot) return;

  message.content = message.content.toLowerCase();

  if (message.channel.name === '📝・sugestões') {
    message.react('✅');
    message.react('❌');
  }

  // Getting args and command name
  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const commandName = (message.content.startsWith(process.env.PREFIX))
    ? args.shift().toLowerCase()
    : message.content;

  // Get command
  const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName));

  if (!command) return;

  const cmdInfo = command.info;

  if (cmdInfo.requirePrefix && !message.content.startsWith(process.env.PREFIX)) return;

  client.logger.cmd(`${message.author.username} (${message.author.id}) executed the "${cmdInfo.name}" command.`);

  // Check if command is 'server only' (can't be executed inside DMs)
  if (cmdInfo.guildOnly && message.channel.type !== 'text') {
    return client.reply({
      message,
      title: 'Você não pode usar este comando aqui.',
      content: 'Este comando só pode ser executado em servidores.'
    });
  }

  // If command needs arguments to be executed, send a error reply message in the chat
  if (cmdInfo.requireArgs && !args.length) {
    let reply = `Você não especificou nenhum parâmetro, ${message.author}.`;

    if (cmdInfo.usage) {
      reply += `\nA maneira de uso correta seria: \`${process.env.PREFIX}${cmdInfo.name} ${cmdInfo.usage}\`.`;
    }

    if (cmdInfo.aliases) {
      const aliases = cmdInfo.aliases.map(item => {
        return `\`${process.env.PREFIX}${item}\``;
      });

      reply += `\nAlém de \`${process.env.PREFIX}${cmdInfo.name}\`, você também pode usar: ${aliases.join(', ')}.`;
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

      message.delete();
      return client.reply({
        message,
        title: 'Cooldown.',
        content: `Por favor, espere ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando \`${process.env.PREFIX}${cmdInfo.name}\` novamente ${message.author}.`,
        time: 5000,
        type: 'warn'
      });
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Execute command
  try {
    if (command.validate) {
      await command.validate(message, cmdInfo, args);
    }
    command.execute(client, message, args);
  } catch (error) {
    client.logger.error(error);
  }
};
