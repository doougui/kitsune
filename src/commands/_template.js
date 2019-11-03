module.exports = {
  // Permissions check, this function isn't required
  validate(client, message) {},

  // Your command execution
  async execute(client, message, args) {},

  // Your command infos
  get cmdInfo() {
    return {
      name: 'commandname',
      description: 'Some description here.',
      guildOnly: true,
      requireArgs: true,
      // The options below are not required
      usage: '<usage>',
      cooldown: 3,
      aliases: ['alias'],
    };
  }
}