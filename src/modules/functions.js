module.exports = {
  getWelcomeChannel(member) {
    const channel = member.guild.channels.find(ch => ch.id === process.env.WELCOME_CHAT);
    if (!channel) return;
  
    return channel;
  },
  
  updateTopicWithEmojiNum(member, channel) {
    const emoji = [':zero:', ':one', ':two', ':three:', ':four:', ':five:', ':six:', ':seven', ':eight', ':nine'];
    const qtMembers = member.guild.memberCount;
    let emojiNum = '';
  
    for (num of qtMembers.toString()) {
      emojiNum += emoji[num];
    }
  
    channel.edit({
      topic: `Atualmente há ${emojiNum} membros no servidor.`
    });
  }
}