module.exports = {
  async execute (client, message, args) {
    message.react('🌅');
    message.channel.send('dia!');
  },

  get info () {
    return {
      name: 'bom dia',
      description: 'Mostra uma mensagem de bom dia.',
      requirePrefix: false
    };
  }
};
