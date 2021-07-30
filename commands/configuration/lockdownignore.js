const { Command } = require('discord-akairo');
const LockdownIgnoreModel = require('../../models/LockdownIgnoreModel.js');
const mongo = require('../../structures/mongo.js');

class Lockdownignore extends Command {
  constructor() {
    super('lockdownignore', {
      aliases: ['lockdownignore', 'ldi'],
      channel: 'guild',
      category: 'Configuration',
      description: {
        content: 'Chooses a channel to ignore for the lockdown command.',
        usage: '[channel]',
      },
      userPermissions: ['MANAGE_GUILD'],
      args: [
        {
          id: 'channel',
          type: 'channel',
        },
      ],
    });
  }

  async exec(message, { channel }) {
    if (!channel)
      return message.channel.send(
        'Please properly provide a channel to ignore.'
      );

    let ignores;

    await mongo().then(async (mongoose) => {
      ignores = (
        (await LockdownIgnoreModel.findOne({
          _id: message.guild.id,
        })) || ''
      ).ignores;
    });

    if (ignores) {
      if (ignores.includes(channel.id))
        return message.channel.send(
          `${channel} is already added to the ignored list.`
        );
    }

    await mongo().then(async (mongoose) => {
      await LockdownIgnoreModel.findOneAndUpdate(
        {
          _id: message.guild.id,
        },
        {
          _id: message.guild.id,
          ignores: (ignores || '').concat([channel.id]) || [channel.id],
        },
        {
          upsert: true,
        }
      );
    });

    return message.channel.send(
      `Added ${channel} to the ignored channels list.`
    );
  }
}

module.exports = Lockdownignore;
