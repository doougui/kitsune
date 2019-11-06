const Discord = require('discord.js');

module.exports = {
  validate (client, message, command) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.reply('você não tem permissão para executar este comando!');
      throw new Error(`${message.author.username} (${message.author.id}) failed to execute the command ${command.name} because he/she has no permission!`);
    }
  },

  async execute (client, message, args) {
    const func = require('../modules/functions');
    const user = func.getUserFromMention(client, args[0]);
    const reason = args.slice(1).join(' ');

    if (!user) {
      return message.reply('um usuário deve ser mencionado antes do motivo!');
    }

    const guildUser = message.guild.member(user);

    const embedPunish = new Discord.RichEmbed()
      .setTitle('``🚔`` » Banimento')
      .addField('``👤`` **Usuário banido:**', guildUser.user, true)
      .addField('``👮`` **banido por:**', message.author, true)
      .addField('``📄`` **Tipo:**', 'Banimento', true)
      .addField('``🕒`` **Tempo:**', 'Permanentemente', true)
      .addField('``📣`` **Motivo:**', reason, true)
      .setThumbnail(guildUser.user.avatarURL)
      .setColor('#a50008')
      .setFooter(
        'Kitsune',
        `${client.user.avatarURL}`
      )
      .setTimestamp();

    try {
      await guildUser.ban(`Motivo: ${reason} | Banido por: ${message.author.tag}`);

      client.logger.log(`${message.author.username} successfully banned ${guildUser.displayName} from the server ${message.guild.name}`);

      message.channel.send('✅ Usuário banido com sucesso.');
      message.channel.send(embedPunish);

      guildUser.send('Você foi banido, mais informações abaixo.', embedPunish)
        .catch((error) => {
          client.logger.warn(`Failed to send direct message to ${guildUser.displayName} with ban details. ${error}`);
        });
    } catch (error) {
      message.reply('não foi possível banir este usuário!');
      client.logger.warn(`${message.author.username} failed to ban ${guildUser.displayName} from the server ${message.guild.name}. ${error}`);
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
