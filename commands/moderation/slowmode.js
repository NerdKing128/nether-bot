const { Command } = require('discord-akairo');
const { formatPms, setArg } = require('../../utils/functions.js');
const ms = require('ms');

class Slowmode extends Command {
  constructor() {
    super('slowmode', {
      aliases: ['slowmode', 'sm'],
      channel: 'guild',
      category: 'Moderation',
      description: {
        content:
          'Sets the slowmode for the current channel or a specific chnanel.',
        usage: '(channel) [number]',
      },
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'channel',
          type: 'channel',
        },
        {
          id: 'time',
          type: 'string',
        },
      ],
    });
  }

  async exec(message, { channel, time }) {
    if (!channel) {
      channel = message.channel;
      time = setArg(message, 0);
    }

    if (!time) {
      return message.channel.send(
        `Slowmode is currently set to ${
          time == '0' ? '0 seconds' : formatPms(channel.rateLimitPerUser * 1000)
        }.`
      );
    }

    if (time.toLowerCase() == 'off') {
      channel.setRateLimitPerUser(0);
      return message.channel.send(
        `Slowmode${
          channel == message.channel ? '' : ` in ${channel}`
        } changed to 0 seconds.`
      );
    }

    if (!time.includes('s') && !time.includes('m') && !time.includes('h'))
      time = `${time * 1000}ms`;

    if (isNaN(ms(time)) && time)
      return message.channel.send('Please provide a valid number.');
    if (time.includes('-'))
      return message.channel.send('Please provide a whole number.');

    time = ms(time);

    if (ms(time) / 1000 > 21600)
      return message.channel.send(
        'Please provide a slowmode less than or equal to 6 hours.'
      );

    channel.setRateLimitPerUser(Math.round(time / 1000));

    return message.channel.send(
      `Slowmode${
        channel == message.channel ? '' : ` in ${channel}`
      } changed to ${time == '0' ? '0 seconds' : formatPms(time)}.`
    );
  }
}

module.exports = Slowmode;
