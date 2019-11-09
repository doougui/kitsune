const Discord = require('discord.js');

module.exports = {
  validate (client, message, command) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.reply('você não tem permissão para executar este comando!');
      throw new Error(`${message.author.username} (${message.author.id}) failed to execute the command ${command.name} because he/she has no permission!`);
    }
  },

  async execute (client, message, args) {
    const helpers = require('../modules/functions');
    const user = helpers.getUserFromMention(client, args[0]);
    const reason = args.slice(1).join(' ');

    if (!user) {
      return message.reply('um usuário válido deve ser mencionado antes do motivo!');
    }

    const userAsMember = message.guild.member(user);

    const embedPunish = new Discord.RichEmbed()
      .setTitle('``🚔`` » Punição')
      .addField('``👤`` **Usuário punido:**', userAsMember.user, true)
      .addField('``👮`` **Punido por:**', message.author, true)
      .addField('``📄`` **Tipo:**', 'Banimento', true)
      .addField('``🕒`` **Tempo:**', 'Permanentemente', true)
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
      await userAsMember.send(`\`\`🚔\`\` Você foi banido do servidor ${message.guild.name}, mais informações abaixo.`, embedPunish);
      client.logger.log(`Successfully sent a message to ${userAsMember.displayName} with ban details.`);
    } catch (error) {
      client.logger.warn(`Failed to send direct message to ${userAsMember.displayName} with ban details. ${error}`);
    }

    try {
      await userAsMember.ban(`Motivo: ${reason} | Punido por: ${message.author.tag}`);

      client.logger.log(`${message.author.username} successfully banned ${userAsMember.displayName} from the server ${message.guild.name}`);
      message.channel.send('``✅`` Usuário banido com sucesso.', embedPunish);
    } catch (error) {
      message.reply('não foi possível banir este usuário!');
      client.logger.warn(`${message.author.username} failed to ban ${userAsMember.displayName} from the server ${message.guild.name}. ${error}`);
    }
  },

  get cmdInfo () {
    return {
      name: 'ban',
      description: 'Ban a user',
      guildOnly: true,
      requireArgs: true,
      usage: '<@usuário> <motivo>',
      cooldown: 3,
      aliases: ['banir']
    };
  }
};
