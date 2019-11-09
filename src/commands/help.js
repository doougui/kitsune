require('dotenv').config({
  path: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.env'
});

const Discord = require('discord.js');

module.exports = {
  async execute (client, message, args) {
    const { commands } = message.client;

    if (!args.length) {
      const commandList = commands.map(command => {
        const { name, description } = command.cmdInfo;
        return { name, description };
      });

      const helpEmbed = new Discord.RichEmbed()
        .setTitle('``👨‍💻`` » Comandos')
        .setDescription('Lista de todos os comandos:')
        .setColor('#a50008')
        .setFooter(
          'Kitsune',
          `${client.user.avatarURL}`
        )
        .setTimestamp();

      for (const commandInfo of commandList) {
        helpEmbed.addField(`${process.env.PREFIX}${commandInfo.name}`, `**Função**: ${commandInfo.description}`);
      }

      return message.author.send(helpEmbed)
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply('te enviei uma mensagem com todos os meus comandos :)');
        })
        .catch(error => {
          client.logger.error(`Could not send help DM to ${message.author.tag}. ${error}`);
          message.reply('não foi possível te enviar uma mensagem com os comandos, talvez você esteja com as mensagem diretas desabilitadas. Ou será que... Você me bloqueou? :(');
        });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) ||
        commands.find(cmd => cmd.cmdInfo.aliases && cmd.cmdInfo.aliases.includes(commandName));

      if (commandName.startsWith(process.env.PREFIX)) {
        return message.reply(`utilize $help <comando> (sem o prefixo (${process.env.PREFIX})).`);
      }

      if (!command) {
        return message.reply('este comando não é válido!');
      }

      const cmdInfo = command.cmdInfo;

      const helpEmbed = new Discord.RichEmbed()
        .setTitle(`\`${process.env.PREFIX}${cmdInfo.name}\``)
        .setDescription(`Informações sobre o comando \`${process.env.PREFIX}${cmdInfo.name}\`:`)
        .setColor('#a50008')
        .setFooter(
          `Comando solicitado por: ${message.author.username}`,
          `${client.user.avatarURL}`
        )
        .setTimestamp();

      if (cmdInfo.aliases) helpEmbed.addField('Alternativas', cmdInfo.aliases.join(', '));
      if (cmdInfo.description) helpEmbed.addField('Descrição', cmdInfo.description);
      if (cmdInfo.usage) helpEmbed.addField('Uso', `${process.env.PREFIX}${cmdInfo.name} ${cmdInfo.usage}`);

      helpEmbed
        .addField('Tempo de espera', `${cmdInfo.cooldown || 3} segundos`);

      return message.channel.send(helpEmbed);
    }
  },

  get cmdInfo () {
    return {
      name: 'help',
      description: 'Show available commands.',
      guildOnly: false,
      requireArgs: false,
      usage: '<opcional: [nome do comando]>',
      aliases: ['commands', 'ajuda', 'comandos']
    };
  }
};
