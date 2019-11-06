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

    if (!guildUser.bannable) {
      return message.reply('este usuário não pode ser banido!');
    }
    console.log(guildUser);

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

    message.channel.send('✅ Usuário banido com sucesso.');
    message.channel.send(embedPunish);

    guildUser.send('Você foi banido, mais informações abaixo.', embedPunish);

    await guildUser.ban(
          `Motivo: ${reason} | Banido por: ${message.author.tag}`
    );
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
