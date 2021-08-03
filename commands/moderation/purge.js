const { Command } = require('discord-akairo');

class Purge extends Command {
  constructor() {
    super('purge', {
      aliases: ['purge', 'bulkdelete', 'bd', 'clear'],
      channel: 'guild',
      category: 'Moderation',
      description: {
        content: 'Purges a specified amount of messages. Max of 100.',
        usage: '[number]',
      },
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'count',
          type: 'number',
        },
      ],
    });
  }

  async exec(message, { count }) {
    message.delete().then(() => {
      if (!count)
        return message.channel
          .send('Please provide a valid number of messages to purge.')
          .then((msg) => msg.delete({ timeout: 5000 }));

      if (count > 100 || count < 1)
        return message.channel
          .send(
            'Please supply a number greater than or equal to 1 or less than or equal to 100.'
          )
          .then((msg) => msg.delete({ timeout: 5000 }));

      message.channel.messages.fetch({ limit: count }).then((messages) => {
        messages = messages.filter(
          (msg) => msg.createdTimestamp > Date.now() - 1.21e9
        );

        message.channel
          .bulkDelete(messages)
          .then(() => {
            return message.channel
              .send('Purge successful.')
              .then((msg) => msg.delete({ timeout: 2000 }));
          })
          .catch((err) => console.log(err));
      });
    });
  }
}

module.exports = Purge;
