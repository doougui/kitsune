module.exports = {
  validate (message, command) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.delete();
      message.client.replier.reply({
        message,
        title: 'Sem permissão.',
        content: 'Você não tem permissão para executar este comando.\nPermissão necessária: `[MANAGE_MESSAGES]`.',
        time: 10000
      });
      throw new Error(`${message.author.username} (${message.author.id}) failed to execute the ${command.name} command because he/she has no permission!`);
    }
  },

  async execute (client, message, args) {
    const amount = parseInt(args[0], 10);

    if (isNaN(amount)) {
      return client.replier.reply({
        message,
        title: 'Número de mensagens inválido.',
        content: 'Você precisa digitar o número de mensagens a serem excluídas.'
      });
    } else if (amount <= 0 || amount > 100) {
      return client.replier.reply({
        message,
        title: 'Número de mensagens inválido.',
        content: 'Você precisa digitar um número maior que 0 e menor que 100.'
      });
    }

    await message.delete();
    await message.channel.fetchMessages({
      limit: amount
    })
      .then(fetchedMessages => {
        message.channel.bulkDelete(fetchedMessages, true)
          .then(removedMessages => message.channel.send(`${removedMessages.size} mensagens foram deletadas!`)
            .then(botMsg => botMsg.delete(3000)))
          .catch(error => {
            message.channel.send(`Não foi possível deletar as mensagens deste canal! ${error}`);
            client.logger.warn(`${message.author.username} (${message.author.id}) failed to delete messages on the ${message.channel.name} channel (${message.guild.name} server)`);
          });
      });
  },

  get info () {
    return {
      name: 'clear',
      description: 'Limpa o chat.',
      guildOnly: true,
      requireArgs: true,
      usage: '<número de mensagens a serem excluídas>',
      cooldown: 5,
      aliases: ['limpar']
    };
  }
};
