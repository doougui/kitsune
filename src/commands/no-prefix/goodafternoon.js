module.exports = {
  async execute (client, message, args) {
    message.react('🌞');
    message.channel.send('tarde!');
  },

  get info () {
    return {
      name: 'boa tarde',
      description: 'Mostra uma mensagem de boa tarde.',
      requirePrefix: false
    };
  }
};
