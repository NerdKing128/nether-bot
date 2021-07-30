const { Command } = require('discord-akairo');

class Setnick extends Command {
  constructor() {
    super('setnick', {
      aliases: ['setnick', 'nick', 'sn'],
      channel: 'guild',
      category: 'Moderation',
      description: {
        content: 'Sets a nickname for a member.',
        usage: '[member] (nick)',
      },
      userPermissions: ['MANAGE_NICKNAMES'],
      args: [
        {
          id: 'member',
          type: 'member',
        },
        {
          id: 'nick',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, { member, nick }) {
    if (!member)
      return message.channel
        .send('You need to actually provide a member to set a nickname to.')
        .then((msg) => msg.delete({ timeout: 5000 }));

    if (nick) {
      if (nick.length > 32)
        return message.channel
          .send(
            'You need to provide a nickname less than or equal to 32 characters.'
          )
          .then((msg) => msg.delete({ timeout: 5000 }));
    }

    await member
      .setNickname(nick || null)
      .then(() => {
        if (!nick) return message.channel.send('Nickname reset.');

        return message.channel.send(`Nickname set to \`${nick}\`.`);
      })
      .catch((error) => {
        if (error.code == 50013)
          return message.channel.send(
            'I do not have permission to change the nickname of this member.'
          );
      });
  }
}

module.exports = Setnick;
