module.exports = {
  getWelcomeChannel (member) {
    const channel = member.guild.channels.find(ch => ch.id === process.env.WELCOME_CHAT);
    if (!channel) return;

    return channel;
  },

  getRandomEmoji (emojis) {
    return emojis[Math.floor(Math.random() * emojis.length)];
  },

  updateTopicWithEmojiNum (member, channel) {
    const emoji = [':zero:', ':one', ':two', ':three:', ':four:', ':five:', ':six:', ':seven', ':eight', ':nine'];
    const qtMembers = member.guild.memberCount;
    let emojiNum = '';

    for (const num of qtMembers.toString()) {
      emojiNum += emoji[num];
    }

    channel.edit({
      topic: `Atualmente há ${emojiNum} membros no servidor.`
    });
  },

  getUserFromMention (client, mention) {
    // The id is the first and only match found by the RegEx.
    const matches = mention.match(/^<@!?(\d+)>$/);

    // If supplied variable was not a mention, matches will be null instead of an array.
    if (!matches) return;

    // However the first element in the matches array will be the entire mention, not just the ID,
    // so use index 1.
    const id = matches[1];

    return client.users.get(id);
  }
};
