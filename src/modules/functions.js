module.exports = {
  getChannel (member, channelId) {
    const channel = member.guild.channels.find(ch => ch.id === channelId);
    if (!channel) return;

    return channel;
  },

  getRandomItem (itens) {
    return itens[Math.floor(Math.random() * itens.length)];
  },

  convertNumberIntoEmoji (member, number) {
    const numEmoji = [':zero:', ':one', ':two', ':three:', ':four:', ':five:', ':six:', ':seven', ':eight', ':nine'];
    let emojiNum = '';

    for (const num of number.toString()) {
      emojiNum += numEmoji[num];
    }

    return emojiNum;
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
