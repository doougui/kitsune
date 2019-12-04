module.exports = async (client) => {
  client.logger.ready(`Bot's ready. Running with ${client.users.size - 1} users in ${client.guilds.size} servers.`);

  client.user.setPresence({
    game: {
      name: 'você | $help',
      type: 'LISTENING'
    },
    status: 'dnd'
  });
};
