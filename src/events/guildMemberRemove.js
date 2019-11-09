module.exports = async (client, member) => {
  const helpers = require('../modules/functions');

  client.logger.log(`${member.displayName} (${member.id}) has left the server ${member.guild}.`);

  const channel = helpers.getWelcomeChannel(member);
  channel.send(`${member} saiu do servidor.`);

  const emojiNum = helpers.convertNumberIntoEmoji(member, member.guild.memberCount);

  channel.edit({
    topic: `Atualmente há ${emojiNum} membros no servidor.`
  });
};
