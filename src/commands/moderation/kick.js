const Discord = require('discord.js');

module.exports = {
  validate (message, command) {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      message.delete();
      message.client.reply({
        message,
        title: 'Sem permissão.',
        content: 'Você não tem permissão para executar este comando.\nPermissão necessária: `[KICK_MEMBERS]`.',
        time: 10000
      });
      throw new Error(`${message.author.username} (${message.author.id}) failed to execute the ${command.name} command because he/she has no permission!`);
    }
  },

  async execute (client, message, args) {
    const user = client.getUserFromMention(client, args[0]);
    const reason = args.slice(1).join(' ');

    if (!user) {
      return client.reply({
        message,
        title: 'Usuário inválido.',
        content: 'Um usuário válido deve ser mencionado antes do motivo!'
      });
    }

    if (!user.bannable) {
      return client.reply({
        message,
        title: 'Impssível expulsar.',
        content: 'Você não pode expulsar um moderador!'
      });
    }

    const userAsMember = message.guild.member(user);

    const embedPunish = new Discord.RichEmbed()
      .setTitle('``🚔`` » Punição')
      .addField('``👤`` **Usuário punido:**', userAsMember.user, true)
      .addField('``👮`` **Punido por:**', message.author, true)
      .addField('``📄`` **Tipo:**', 'Expulsão', true)
      .setThumbnail(userAsMember.user.avatarURL)
      .setColor('#a50008')
      .setFooter(
        'Kitsune',
        `${client.user.avatarURL}`
      )
      .setTimestamp();

    if (reason) {
      embedPunish.addField('``📣`` **Motivo:**', reason, true);
    }

    try {
      await userAsMember.send(`\`\`🚔\`\` Você foi expulso do servidor **${message.guild.name}**, mais informações abaixo.`, embedPunish);
      client.logger.log(`Successfully sent a message to ${userAsMember.displayName} with kick details.`);
    } catch (error) {
      client.logger.warn(`Failed to send direct message to ${userAsMember.displayName} with kick details. ${error}`);
    }

    try {
      await userAsMember.kick(`Motivo: ${reason} | Punido por: ${message.author.tag}`);

      client.logger.log(`${message.author.username} successfully kicked ${userAsMember.displayName} from the server ${message.guild.name}`);
      message.channel.send('``✅`` Usuário expulso com sucesso.', embedPunish);
    } catch (error) {
      client.reply({
        message,
        title: 'Impossível banir.',
        content: 'Não foi possível expulsar este usuário!'
      });

      client.logger.warn(`${message.author.username} failed to kick ${userAsMember.displayName} from the server ${message.guild.name}. ${error}`);
    }
  },

  get info () {
    return {
      name: 'kick',
      description: 'Expulsa um usuário do servidor.',
      guildOnly: true,
      requireArgs: true,
      usage: '<@usuário> <motivo>',
      cooldown: 3,
      aliases: ['kickar', 'expulsar']
    };
  }
};
