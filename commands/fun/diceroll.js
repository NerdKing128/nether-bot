const { Command } = require('discord-akairo');

class Diceroll extends Command {
  constructor() {
    super('diceroll', {
      aliases: ['diceroll', 'roll', 'dice', 'dr'],
      channel: 'guild',
      category: 'Fun',
      description: {
        content: 'Rolls a dice, showing a random number between 1-6.',
      },
    });
  }

  async exec(message) {
    return message.channel.send(
      `You rolled a dice, landing on the number **${
        Math.floor(Math.random() * 6) + 1
      }**.`
    );
  }
}

module.exports = Diceroll;
