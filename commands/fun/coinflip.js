const { Command } = require('discord-akairo');

class Coinflip extends Command {
  constructor() {
    super('coinflip', {
      aliases: ['coinflip', 'flipcoin', 'cf'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: 'Flips a coin, showing either heads or tails.',
      },
    });
  }

  async exec(message) {
    const picks = ['Heads', 'Tails'];
    const randomize = Math.floor(Math.random() * picks.length);

    return message.channel.send(
      `Your coin landed on.. **${picks[randomize]}**!`
    );
  }
}

module.exports = Coinflip;
