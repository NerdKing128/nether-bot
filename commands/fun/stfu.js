const { Command } = require('discord-akairo');
const { MessageAttachment } = require('discord.js');

class Stfu extends Command {
  constructor() {
    super('stfu', {
      aliases: ['stfu'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: 'Sends a rather interesting image with a ping.',
        usage: '[member] (channel)',
      },
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          id: 'member',
          type: 'member',
        },
        {
          id: 'channel',
          type: 'channel',
        },
      ],
    });
  }

  async exec(message, { member, channel }) {
    message.delete();

    if (!member)
      return message.channel
        .send('You gotta mention someone to stfu. Smh.')
        .then((msg) => msg.delete({ timeout: 5000 }));
    if (!channel) channel = message.channel;

    const attach = new MessageAttachment(
      'https://media.discordapp.net/attachments/689192077237551145/850393439128518656/MonkeSTFU.PNG',
      'MonkeSTFU.png'
    );

    return channel.send(member, attach);
  }
}

module.exports = Stfu;
