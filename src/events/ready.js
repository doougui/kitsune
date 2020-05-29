module.exports = async client => {
  client.logger.ready(`Bot's ready. Running with ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`);

  client.user.setPresence({
    activity: {
      name: `${process.env.PREFIX}help in ${client.guilds.cache.size} servers!`,
      type: 'LISTENING'
    },
    status: 'dnd'
  });
};
