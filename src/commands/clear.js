module.exports = {
  validate(client, message) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.reply('você não tem permissão para executar este comando!');
      throw new Error(`${message.author.username} (${message.author.id}) failed to execute the command ${cmdInfo.name} because he/she has no permission!`);
    }
  },

  async execute(client, message, args) {
    await message.delete();

    if (!args.length) {
      return message.reply('você não especificou o número de mensagens.');
    }

    const amount = parseInt(args[0], 10);

    if (isNaN(amount)) {
      return message.reply('você precisa digitar o número de mensagens a serem excluídas.');
    } else if (amount <= 0 || amount > 100) {
      return message.reply('você precisa digitar um número maior que 0 e menor que 100.');
    }

    await message.channel.fetchMessages({ limit: amount })
      .then(fetchedMessages => {
        message.channel.bulkDelete(fetchedMessages, true)
          .then(removedMessages => message.channel.send(`${removedMessages.size} mensagens foram deletadas!`)
            .then(botMsg => botMsg.delete(3000)))
          .catch(err => message.channel.send(`Não foi possível deletar as mensagens deste canal! Erro: ${err}`));
      });
  },

  get cmdInfo() {
    return {
      name: 'clear',
      description: 'Clean the chat.',
      guildOnly: true,
      requireArgs: true,
      usage: '<número de mensagens a serem excluídas>',
      cooldown: 5,
      aliases: ['limpar'],
    };
  }
}