const { Command } = require('discord-akairo');

class Demot extends Command {
  constructor() {
    super('demot', {
      aliases: ['demot'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: 'Demot an abusive mod!!1!1!1!1!!',
        usage: '[member]',
      },
      userPermissions: ['MANAGE_CHANNELS'],
      args: [
        {
          id: 'member',
          type: 'member',
        },
      ],
    });
  }

  async exec(message, { member }) {
    if (!member)
      return message.channel.send(
        'You needa actually mention a proper member to demot.'
      );

    if (member == message.member)
      return message.channel.send('Demoting yourself is stupid.');
    if (member.user == this.client.user) return message.channel.send('No.');
    if (member.user.bot)
      return message.channel.send(
        "Demoting a bot ain't really gonna do you any good."
      );

    if (!member.hasPermission('MANAGE_MESSAGES'))
      return message.channel.send(
        "A no perm member cannot get a demot. They don't deserve it, anyways."
      );
    if (member !== message.guild.owner) {
      if (member.hasPermission('ADMINISTRATOR'))
        return message.channel.send('Demot a mod, not an admin. Smh.');
    }

    const msg = await message.channel.send(
      'Super secret demot system starting..'
    );

    const types = [
      'ban many members for no reason',
      'aboose',
      'harass the admins',
      'not care',
      'exist',
      'commit tax fraud',
      'have a bad time',
      'delay mod apps',
      'die thrice in a row',
      'eval the bot token',
    ];
    const pick = Math.floor(Math.random() * types.length);

    setTimeout(function () {
      msg.edit(
        `Mod has shown to ${types[pick]}. Continuing with the process..`
      );
      setTimeout(function () {
        msg.edit("Mod isn't owner. Continuing the process..");
        setTimeout(function () {
          return msg.edit(`${member} has been demot. F.`);
        }, 13000);
      }, 9000);
    }, 5000);
  }
}

module.exports = Demot;
