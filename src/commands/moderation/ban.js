const Discord = require('discord.js');

module.exports = {
  validate (message, command) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.delete();
      message.client.reply({
        message,
        title: 'Sem permissão.',
        content: 'Você não tem permissão para executar este comando.\nPermissão necessária: `[BAN_MEMBERS]`.',
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
        title: 'Impssível banir.',
        content: 'Você não pode banir um moderador!'
      });
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
      await userAsMember.send(`\`\`🚔\`\` Você foi banido do servidor **${message.guild.name}**, mais informações abaixo.`, embedPunish);
      client.logger.log(`Successfully sent a message to ${userAsMember.displayName} with ban details.`);
    } catch (error) {
      client.logger.warn(`Failed to send direct message to ${userAsMember.displayName} with ban details. ${error}`);
    }

    try {
      await userAsMember.ban(`Motivo: ${reason} | Punido por: ${message.author.tag}`);

      client.logger.log(`${message.author.username} successfully banned ${userAsMember.displayName} from the server ${message.guild.name}`);
      message.channel.send('``✅`` Usuário banido com sucesso.', embedPunish);
    } catch (error) {
      client.reply({
        message,
        title: 'Impossível banir.',
        content: 'Não foi possível banir este usuário!'
      });

      client.logger.warn(`${message.author.username} failed to ban ${userAsMember.displayName} from the server ${message.guild.name}. ${error}`);
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
