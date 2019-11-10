require('dotenv').config({
  path: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.env'
});

const Discord = require('discord.js');

module.exports = {
  async execute (client, message, args) {
    const { commands } = message.client;

    if (!args.length) {
      const commandList = commands.map(command => {
        const { name, description } = command.info;
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
          return client.replier.reply({
            message,
            title: 'Lista de comandos enviada.',
            content: 'Te enviei uma mensagem com todos os meus comandos :)',
            type: 'success'
          });
        })
        .catch(error => {
          client.logger.error(`Could not send DM with the list of commands to ${message.author.tag}. ${error}`);
          return client.replier.reply({
            message,
            title: 'Não foi possível te enviar a mensagem.',
            content: 'Não foi possível te enviar uma mensagem com os comandos, talvez você esteja com as mensagem diretas desabilitadas. Ou será que... Você me bloqueou? :('
          });
        });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) ||
        commands.find(cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName));

      if (commandName.startsWith(process.env.PREFIX)) {
        return client.replier.reply({
          message,
          title: 'Formato inválido.',
          content: `Utilize $help <comando> (sem o prefixo (${process.env.PREFIX})).`
        });
      }

      if (!command) {
        return client.replier.reply({
          message,
          title: 'Comando inválido.',
          content: 'Este comando não é válido!'
        });
      }

      const cmdInfo = command.info;

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

  get info () {
    return {
      name: 'help',
      description: 'Lista os comandos disponíveis ou informações sobre um determinado comando.',
      guildOnly: false,
      requireArgs: false,
      usage: '<opcional: [nome do comando]>',
      aliases: ['commands', 'ajuda', 'comandos']
    };
  }
};
