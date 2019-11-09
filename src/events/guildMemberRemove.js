module.exports = async (client, member) => {
  const helpers = require('../modules/functions');

  client.logger.log(`${member.displayName} (${member.id}) has left the server ${member.guild}.`);

  const channel = helpers.getWelcomeChannel(member);
  channel.send(`${member} saiu do servidor.`);

  helpers.updateTopicWithEmojiNum(member, channel);
};
