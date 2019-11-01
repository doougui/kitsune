require('dotenv/config')
const Discord = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Show available commands.',
  aliases: ['commands', 'ajuda', 'comandos'],
  async execute(message, args) {
    const { commands } = message.client;

    if (!args.length) {
      commandList = commands.map(command => {
        let { name, description } = command;
        return { name, description };
      });

      const helpEmbed = new Discord.RichEmbed()
        .setColor('#a50008')
        .setTitle('Comandos')
        .setURL('https://github.com/doougui/kitsune')
        .setDescription('Aqui está a lista de todos os comandos disponíveis:')
        .setTimestamp()
        .setFooter('Kitsune', 'https://cdn131.picsart.com/272777513014211.png?r1024x1024');

      for (commandInfo of commandList) {
        helpEmbed.addField(`${process.env.PREFIX}${commandInfo.name}`, `**Função**: ${commandInfo.description}`);
      }

      return message.author.send(helpEmbed)
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply('te enviei uma mensagem com todos os meus comandos :)');
        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          message.reply('não foi possível te enviar uma mensagem com os comandos, talvez você esteja com as mensagem diretas desabilitadas. Ou será que... Você me bloqueou? :(');
        });
    } else {
      const name = args[0].toLowerCase();
      const commandInfo = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

      if (name.startsWith(process.env.PREFIX)) {
        return message.reply(`utilize $help <comando> (sem o prefixo (${process.env.PREFIX})).`);
      }

      if (!commandInfo) {
        return message.reply(`este comando não é válido!`);
      }

      const helpEmbed = new Discord.RichEmbed()
        .setColor('#a50008')
        .setTitle(`\`${process.env.PREFIX}${commandInfo.name}\``)
        .setDescription(`Informações sobre o comando \`${process.env.PREFIX}${commandInfo.name}\`:`)
        .setTimestamp()
        .setFooter(`Comando solicitado por: ${message.author.username}`, 'https://cdn131.picsart.com/272777513014211.png?r1024x1024');

      if (commandInfo.aliases) helpEmbed.addField(`Alternativas`, commandInfo.aliases.join(', '));
      if (commandInfo.description) helpEmbed.addField(`Descrição`, commandInfo.description);
      if (commandInfo.usage) helpEmbed.addField(`Uso`, `${process.env.PREFIX}${commandInfo.name} ${commandInfo.usage}`);

      helpEmbed.addField(`Tempo de espera`, `${commandInfo.cooldown || 3} segundos`);

      return message.channel.send(helpEmbed);
    }
  }
}