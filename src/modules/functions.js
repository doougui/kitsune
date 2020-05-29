/* eslint-disable no-unused-expressions */

const Discord = require('discord.js');

module.exports = async client => {
  client.getChannel = ({ member, guild, channelId }) => {
    const channel = (member)
      ? member.guild.channels.cache.find(ch => ch.id === channelId)
      : guild.channels.cache.find(ch => ch.id === channelId); ;

    if (!channel) return;

    return channel;
  };

  client.getRandomItem = itens => {
    return itens[Math.floor(Math.random() * itens.length)];
  };

  client.convertNumberIntoEmoji = (number) => {
    const numEmoji = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:'];
    let emojiNum = '';

    for (const num of number.toString()) {
      emojiNum += numEmoji[num];
    }

    return emojiNum;
  };

  client.getUserFromMention = (mention, guild = null, guildMember = false) => {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    const user = client.users.cache.get(id);

    return (guildMember && guild) ? guild.member(user) : user;
  };

  client.createSilenceRole = async guild => {
    const newSilenceRole = await guild.roles.create({
      data: {
        name: '🙊 Mutado',
        color: 'GRAY',
        permissions: 0
      },
      reason: 'Cargo atribuido a usuários mutados.'
    });

    const channels = guild.channels.cache;

    channels.forEach(async channel => {
      await channel.updateOverwrite(newSilenceRole, {
        SEND_MESSAGES: false
      });
    });

    return newSilenceRole;
  };

  // TO-DO: substituir message por channel e author
  client.reply = async ({ message, title, content, time = 0, type = 'error' }) => {
    const emojis = {
      error: '❌',
      warn: '⚠️',
      success: '✅'
    };

    const emoji = emojis[type];

    if (!emoji) {
      throw new Error('Replier type must be either error, warn or success.');
    }

    const replyEmbed = new Discord.MessageEmbed()
      .setTitle(`\`\`${emoji}\`\` » ${title}`)
      .setDescription(content)
      .setColor('#a50008')
      .setFooter(
        'Kitsune',
        client.user.avatarURL()
      )
      .setTimestamp();

    try {
      const msg = await message.channel.send(message.author, replyEmbed);
      if (time === 0) return;
      msg.delete({ timeout: time });
    } catch (error) {
      message.client.logger.warn(`Failed to send a reply message to ${message.author.username}. ${error}`);
    }
  };

  client.awaitReply = async (msg, limit = 30000) => {
    const filter = m => m.author.id === msg.author.id;

    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (error) {
      return false;
    }
  };
};
