module.exports = async (client, member) => {
  const func = require('../modules/functions');

  client.logger.log(`${member.displayName} (${member.id}) has entered the server ${member.guild}.`);

  const channel = func.getWelcomeChannel(member);
  channel.send(`Bem-vindo ao servidor, ${member}.`);

  func.updateTopicWithEmojiNum(member, channel);
};
