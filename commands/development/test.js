const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { formatPms } = require('../../utils/functions.js');

class Test extends Command {
  constructor() {
    super('test', {
      aliases: ['test', 't'],
      channel: 'guild',
      category: 'Development',
      description: {
        content:
          'A command that can be literally anything. What the command contains can vary dependent on testing.\nCurrently, this command is testing nothing.',
        usage: '(something interesting)',
      },
      ownerOnly: true,
      args: [
        {
          id: 'content',
          type: 'string',
        },
      ],
    });
  }

  async exec(message, { content }) {}
}

module.exports = Test;
