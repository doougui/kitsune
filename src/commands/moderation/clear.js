module.exports = {
  validate (message, command) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      message.delete();
      message.client.reply({
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
      return client.reply({
        message,
        title: 'Número de mensagens inválido.',
        content: 'Você precisa digitar o número de mensagens a serem excluídas.'
      });
    } else if (amount <= 0 || amount > 100) {
      return client.reply({
        message,
        title: 'Número de mensagens inválido.',
        content: 'Você precisa digitar um número maior que 0 e menor que 100.'
      });
    }

    await message.delete();

    try {
      const fetchedMessages = await message.channel.messages.fetch({ limit: amount });
      const removedMessages = await message.channel.bulkDelete(fetchedMessages, true);

      const botMsg = await message.channel.send(`${removedMessages.size} mensagens foram deletadas!`);

      botMsg.delete({ timeout: 3000 });
    } catch (error) {
      message.channel.send('Não foi possível deletar as mensagens deste canal!');
      client.logger.warn(`${message.author.username} (${message.author.id}) failed to delete messages on the ${message.channel.name} channel (${message.guild.name} server). Error: ${error}`);
    }
  },

  get info () {
    return {
      name: 'clear',
      description: 'Limpa o chat.',
      guildOnly: true,
      requireArgs: true,
      requirePrefix: true,
      usage: '<número de mensagens a serem excluídas>',
      cooldown: 5,
      aliases: ['limpar']
    };
  }
};
