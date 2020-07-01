const Discord = require('discord.js');

module.exports = {
  validate (message, command) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.delete();
      message.client.reply({
        message,
        title: 'Sem permissão.',
        content:
          'Você não tem permissão para executar este comando.\nPermissão necessária: `[BAN_MEMBERS]`.',
        time: 10000
      });
      throw new Error(
        `${message.author.username} (${message.author.id}) failed to execute the ${command.name} command because he/she has no permission!`
      );
    }
  },

  async execute (client, message, args) {
    const guildMember = client.getUserFromMention(args[0], message.guild, true);
    const reason = args.slice(1).join(' ');

    if (!guildMember) {
      return client.reply({
        message,
        title: 'Usuário inválido.',
        content: 'Um usuário válido deve ser mencionado antes do motivo!'
      });
    }

    const embedPunish = new Discord.MessageEmbed()
      .setTitle('``🚔`` » Punição')
      .addField('``👤`` **Usuário punido:**', guildMember.user, true)
      .addField('``👮`` **Punido por:**', message.author, true)
      .addField('``📄`` **Tipo:**', 'Banimento', true)
      .addField('``🕒`` **Tempo:**', 'Permanentemente', true)
      .setThumbnail(guildMember.user.avatarURL())
      .setColor('#a50008')
      .setFooter('Kitsune', client.user.avatarURL())
      .setTimestamp();

    if (reason) {
      embedPunish.addField('``📣`` **Motivo:**', reason, true);
    }

    try {
      await guildMember.send(
        `\`\`🚔\`\` Você foi banido do servidor **${message.guild.name}**, mais informações abaixo.`,
        embedPunish
      );
      client.logger.log(
        `Successfully sent a message to ${guildMember.displayName} with ban details.`
      );
    } catch (error) {
      client.logger.warn(
        `Failed to send direct message to ${guildMember.displayName} with ban details. ${error}`
      );
    }

    try {
      await guildMember.ban({ days: 7, reason });

      // `Motivo: ${reason} | Punido por: ${message.author.tag}`

      client.logger.log(
        `${message.author.username} successfully banned ${guildMember.displayName} from the server ${message.guild.name}`
      );
      message.channel.send('``✅`` Usuário banido com sucesso.', embedPunish);
    } catch (error) {
      client.reply({
        message,
        title: 'Impossível banir.',
        content: 'Não foi possível banir este usuário!'
      });

      client.logger.warn(
        `${message.author.username} failed to ban ${guildMember.displayName} from the server ${message.guild.name}. ${error}`
      );
    }
  },

  get info () {
    return {
      name: 'ban',
      description: 'Bane um usuário do servidor.',
      guildOnly: true,
      requireArgs: true,
      requirePrefix: true,
      usage: '<@usuário> <motivo>',
      cooldown: 3,
      aliases: ['banir']
    };
  }
};
