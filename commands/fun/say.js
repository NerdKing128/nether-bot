const { Command } = require('discord-akairo');
const { setArg } = require('../../utils/functions.js');

class Say extends Command {
  constructor() {
    super('say', {
      aliases: ['say', 's', 'echo'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: 'Sends a message of the desired content.',
        usage: '(channel) [content]',
      },
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          id: 'channel',
          type: 'channel',
        },
        {
          id: 'content',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, { channel, content }) {
    message.delete();

    if (!channel) {
      channel = message.channel;
      content = setArg(message, 0, true);
    }

    if (!content)
      return message.channel
        .send('Please provide message content.')
        .then((msg) => msg.delete({ timeout: 3500 }));

    return channel.send(content).catch((err) => console.log(err));
  }
}

module.exports = Say;
