/* eslint-disable no-unused-expressions */

const Discord = require('discord.js');

module.exports = async client => {
  client.getChannel = ({ member, guild, channelId }) => {
    const channel = (member)
      ? member.guild.channels.find(ch => ch.id === channelId)
      : guild.channels.find(ch => ch.id === channelId); ;

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

  client.getUserFromMention = (client, mention) => {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return client.users.get(id);
  };

  client.reply = ({ message, title, content, time = 0, type = 'error' }) => {
    let emoji = '';

    switch (type) {
      case 'error':
        emoji = '❌';
        break;
      case 'warn':
        emoji = '⚠️';
        break;
      case 'success':
        emoji = '✅';
        break;
      default:
        throw new TypeError('Replier type must be either error, warn or success.');
    }

    const replyEmbed = new Discord.RichEmbed()
      .setTitle(`\`\`${emoji}\`\` » ${title}`)
      .setDescription(content)
      .setColor('#a50008')
      .setFooter(
        'Kitsune',
        `${message.client.user.avatarURL}`
      )
      .setTimestamp();

    message.channel.send(
      message.author,
      replyEmbed
    )
      .then(msg => {
        if (time === 0) return;
        msg.delete(time);
      })
      .catch(error => {
        message.client.logger.warn(`Failed to send a reply message to ${message.author.username}. ${error}`);
      });
  };
};
