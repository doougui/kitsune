module.exports = async client => {
  client.logger.ready(`Bot's ready. Running with ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`);

  client.user.setPresence({
    activity: {
      name: 'você | $help',
      type: 'LISTENING'
    },
    status: 'dnd'
  });
};
