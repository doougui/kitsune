const Discord = require('discord.js');

exports.reply = ({ message, title, content, time = 0, type = 'error' }) => {
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
