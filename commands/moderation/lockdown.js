const { Command } = require('discord-akairo');
const LockdownIgnoreModel = require('../../models/LockdownIgnoreModel.js');
const { getArgs, setArg } = require('../../utils/functions.js');
const mongo = require('../../structures/mongo.js');

class Lockdown extends Command {
  constructor() {
    super('lockdown', {
      aliases: ['lockdown', 'lock', 'ld'],
      channel: 'guild',
      category: 'Moderation',
      description: {
        content: 'Locks or unlocks a channel or the entire server.',
        usage: '(channel) (reason) (flag)',
      },
      userPermissions: ['MANAGE_ROLES'],
      args: [
        {
          id: 'channel',
          type: 'string',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
    });
  }

  async exec(message, { channel, reason }) {
    const flag = '-end';
    const args = getArgs(message);
    channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    let type = false;

    if (!channel) {
      channel = null;
      reason = setArg(message, 0, true);

      if (!reason) reason = 'No reason provided';

      let ignores;
      await mongo().then(async (mongoose) => {
        ignores =
          (
            await LockdownIgnoreModel.findOne({
              _id: message.guild.id,
            })
          )?.ignores || [];
      });

      const channels = message.guild.channels.cache.filter(
        (c) => c.type !== 'category' && !ignores.includes(c.id)
      );

      let c = 0;

      if (args.join(' ').toLowerCase().endsWith(flag)) {
        if (reason !== 'No reason provided') {
          reason = reason.slice(0, -flag.length - 1);
          if (reason.length == 0) reason = 'No reason provided';
          type = null;
        }
      }

      channels.forEach((channel) => {
        channel
          .updateOverwrite(message.guild.id, {
            SEND_MESSAGES: type,
            ADD_REACTIONS: type,
            SPEAK: type,
            CONNECT: type,
          })
          .then(() => {
            c = ++c;

            if (channel.type == 'text') {
              if (type == false) {
                channel
                  .send('The server is on lockdown.')
                  .then((msg) => msg.delete({ timeout: 30000 }));
              } else {
                channel
                  .send('The server has been unlocked.')
                  .then((msg) => msg.delete({ timeout: 30000 }));
              }
            }
          })
          .catch((err) => console.log(err));
      });

      setTimeout(function () {
        message.channel.send(
          `Successfully updated ${c}/${channels.size} channels.`
        );
      }, 5000);

      return;
    } else {
      if (!reason) reason = 'No reason provided';
      if (channel.type == 'category')
        return message.channel.send('You cannot lock a category channel.');

      if (args.slice(1).join(' ').toLowerCase().endsWith(flag)) {
        if (reason !== 'No reason provided') {
          reason = reason.slice(0, -flag.length - 1);
          if (reason.length == 0) reason = 'No reason provided';
          type = null;
        }
      }

      channel
        .updateOverwrite(message.guild.id, {
          SEND_MESSAGES: type,
          ADD_REACTIONS: type,
          SPEAK: type,
        })
        .then(() => {
          if (channel.type == 'text') {
            if (type == false) {
              channel
                .send('This channel has been locked.')
                .then((msg) => msg.delete({ timeout: 30000 }));
            } else {
              channel
                .send('This channel has been unlocked.')
                .then((msg) => msg.delete({ timeout: 30000 }));
            }
          }
        })
        .catch((err) => console.log(err));

      return message.channel.send(`Successfully updated ${channel}.`);
    }
  }
}

module.exports = Lockdown;
