const Discord = require('discord.js');

module.exports = {
  async execute (client, message, args) {
    const avatarEmbed = new Discord.RichEmbed()
      .setColor('#a50008');

    if (!message.mentions.users.size) {
      avatarEmbed
        .setTitle('``👤`` » Seu avatar')
        .setImage(message.author.displayAvatarURL);

      return message.channel.send(avatarEmbed);
    }

    if (message.mentions.users.size <= 3) {
      message.mentions.users.map(user => {
        avatarEmbed
          .setTitle(`\`\`👥\`\` » Avatar de ${user.username}`)
          .setImage(user.displayAvatarURL);

        return message.channel.send(avatarEmbed);
      });
    } else {
      client.logger.warn(`${message.author.username} failed to get avatars because he/she specified more than 3 users.`);
      return message.reply('você pode pegar o avatar de apenas três usuários por vez.');
    }
  },

  get info () {
    return {
      name: 'avatar',
      description: 'Mostra o seu avatar ou o avatar de um (ou mais) usuários.',
      guildOnly: false,
      requireArgs: false,
      usage: '<opcional: [usuário]>'
    };
  }
};
