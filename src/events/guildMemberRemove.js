module.exports = async (client, member) => {
  const func = require('../modules/functions');

  client.logger.log(`${member.displayName} (${member.id}) has left the server ${member.guild}.`);

  const channel = func.getWelcomeChannel(member);
  channel.send(`${member} saiu do servidor.`);

  func.updateTopicWithEmojiNum(member, channel);
};
