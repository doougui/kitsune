module.exports = {
  async execute (client, message, args) {
    message.react('🌞');
    message.channel.send(`${args[1]}!`);
  },

  get info () {
    return {
      name: 'boa tarde',
      description: 'Mostra uma mensagem de boa tarde.',
      requirePrefix: false,
      aliases: ['boa tarda']
    };
  }
};
