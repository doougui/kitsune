const Discord = require('discord.js');

module.exports = {
  async execute (client, message, args) {
    const { commands } = message.client;
    const noPrefixCommands = [];

    if (!args.length) {
      const commandList = commands.map(command => {
        const { name, description, requirePrefix } = command.info;
        return { name, description, requirePrefix };
      });

      const cmdEmbed = new Discord.MessageEmbed()
        .setTitle('``👨‍💻`` » Comandos')
        .setDescription('Lista de todos os comandos:')
        .setColor('#a50008')
        .setFooter('Kitsune', client.user.avatarURL)
        .setTimestamp();

      for (const commandInfo of commandList) {
        if (commandInfo.requirePrefix) {
          cmdEmbed.addField(
            `${process.env.PREFIX}${commandInfo.name}`,
            `**Função**: ${commandInfo.description}`
          );
        } else {
          noPrefixCommands.push(commandInfo);
        }
      }

      const noPrefixEmbed = new Discord.MessageEmbed()
        .setTitle('``💬`` » Respostas de chat (sem prefixo)')
        .setDescription('Lista de todos os comandos sem prefixo:')
        .setColor('#a50008')
        .setFooter('Kitsune', client.user.avatarURL)
        .setTimestamp();

      for (const noPrefixCmd of noPrefixCommands) {
        noPrefixEmbed.addField(
          noPrefixCmd.name,
          `**Função**: ${noPrefixCmd.description}`
        );
      }
      try {
        await message.author.send(cmdEmbed);
        await message.author.send(noPrefixEmbed);

        if (message.channel.type === 'dm') return;

        return client.reply({
          message,
          title: 'Lista de comandos enviada.',
          content: 'Te enviei uma mensagem com todos os meus comandos :)',
          type: 'success'
        });
      } catch (error) {
        client.logger.error(
          `Could not send DM with the list of commands to ${message.author.tag}. ${error}`
        );
        return client.reply({
          message,
          title: 'Não foi possível te enviar a mensagem.',
          content:
            'Não foi possível te enviar uma mensagem com os comandos, talvez você esteja com as mensagem diretas desabilitadas. Ou será que... Você me bloqueou? :('
        });
      }
    } else {
      const commandName =
        args.length === 1 ? args[0].toLowerCase() : args.join(' ');

      const command =
        commands.get(commandName) ||
        commands.find(
          cmd => cmd.info.aliases && cmd.info.aliases.includes(commandName)
        );

      if (commandName.startsWith(process.env.PREFIX)) {
        return client.reply({
          message,
          title: 'Formato inválido.',
          content: `Utilize $help <comando> (sem o prefixo (${process.env.PREFIX})).`
        });
      }

      if (!command) {
        return client.reply({
          message,
          title: 'Comando inválido.',
          content: 'Este comando não é válido!'
        });
      }

      const cmdInfo = command.info;

      const cmdEmbed = new Discord.MessageEmbed()
        .setTitle(
          `\`${cmdInfo.requirePrefix ? process.env.PREFIX : ''}${
            cmdInfo.name
          }\``
        )
        .setDescription(
          `Informações sobre o comando \`${
            cmdInfo.requirePrefix ? process.env.PREFIX : ''
          }${cmdInfo.name}\`:`
        )
        .setColor('#a50008')
        .setFooter(
          `Comando solicitado por: ${message.author.username}`,
          client.user.avatarURL
        )
        .setTimestamp();

      if (cmdInfo.aliases) {
        cmdEmbed.addField('Alternativas', cmdInfo.aliases.join(', '));
      }
      if (cmdInfo.description) {
        cmdEmbed.addField('Descrição', cmdInfo.description);
      }
      if (cmdInfo.usage) {
        cmdEmbed.addField(
          'Uso',
          `${process.env.PREFIX}${cmdInfo.name} ${cmdInfo.usage}`
        );
      }

      cmdEmbed.addField('Tempo de espera', `${cmdInfo.cooldown || 3} segundos`);

      return message.channel.send(cmdEmbed);
    }
  },

  get info () {
    return {
      name: 'help',
      description:
        'Lista os comandos disponíveis ou informações sobre um determinado comando.',
      guildOnly: false,
      requireArgs: false,
      requirePrefix: true,
      usage: '<opcional: [nome do comando]>',
      aliases: ['commands', 'ajuda', 'comandos']
    };
  }
};
