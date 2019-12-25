const Discord = require('discord.js');

module.exports = {
  validate (message, command) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      message.delete();
      message.client.reply({
        message,
        title: 'Sem permissão.',
        content: 'Você não tem permissão para executar este comando.\nPermissão necessária: `[MUTE_MEMBERS]`.',
        time: 10000
      });
      throw new Error(`${message.author.username} (${message.author.id}) failed to execute the ${command.name} command because he/she has no permission!`);
    }
  },

  async execute (client, message, args) {
    let silenceRole = await message.guild.roles.get(process.env.SILENCE_ROLE);

    if (!silenceRole) {
      silenceRole = await client.createSilenceRole(message.guild);
    }

    const guildMember = client.getUserFromMention(args[0], message.guild, true);
    const reason = args.slice(1).join(' ');

    if (!guildMember) {
      return client.reply({
        message,
        title: 'Usuário inválido.',
        content: 'Um usuário válido deve ser mencionado antes do motivo!'
      });
    }

    const embedPunish = new Discord.RichEmbed()
      .setTitle('``🚔`` » Punição')
      .addField('``👤`` **Usuário punido:**', guildMember.user, true)
      .addField('``👮`` **Punido por:**', message.author, true)
      .addField('``📄`` **Tipo:**', 'Silenciamento', true)
      .addField('``🕒`` **Tempo:**', 'Permanentemente', true)
      .setThumbnail(guildMember.user.avatarURL)
      .setColor('#a50008')
      .setFooter(
        'Kitsune',
        client.user.avatarURL
      )
      .setTimestamp();

    if (reason) {
      embedPunish.addField('``📣`` **Motivo:**', reason, true);
    }

    try {
      if (guildMember.roles.has(silenceRole.id)) {
        client.reply({
          message,
          title: 'Impossível silenciar.',
          content: 'Este usuário já esta silenciado!'
        });

        return client.logger.warn(`${message.author.username} failed to silence ${guildMember.displayName} on the server ${message.guild.name} because this user is already silenced.`);
      }

      await guildMember.addRole(silenceRole, reason);

      client.logger.log(`${message.author.username} successfully silenced ${guildMember.displayName} on the server ${message.guild.name}`);
      message.channel.send('``✅`` Usuário silenciado com sucesso.', embedPunish);
    } catch (error) {
      client.reply({
        message,
        title: 'Impossível silenciar.',
        content: 'Não foi possível silenciar este usuário!'
      });

      return client.logger.warn(`${message.author.username} failed to silence ${guildMember.displayName} on the server ${message.guild.name}. ${error}`);
    }

    try {
      await guildMember.send(`\`\`🚔\`\` Você foi silenciado do servidor **${message.guild.name}**, mais informações abaixo.`, embedPunish);
      client.logger.log(`Successfully sent a message to ${guildMember.displayName} with silencing details.`);
    } catch (error) {
      client.logger.warn(`Failed to send direct message to ${guildMember.displayName} with silencing details. ${error}`);
    }
  },

  get info () {
    return {
      name: 'silence',
      description: 'Silencia um usuário no servidor.',
      guildOnly: true,
      requireArgs: true,
      requirePrefix: true,
      usage: '<@usuário> <motivo>',
      cooldown: 3,
      aliases: ['mute', 'mutar', 'silenciar', 'silent']
    };
  }
};
