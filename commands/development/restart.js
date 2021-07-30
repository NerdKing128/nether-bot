const { Command } = require('discord-akairo');

class Restart extends Command {
  constructor() {
    super('restart', {
      aliases: ['restart', 'reboot'],
      channel: 'guild',
      category: 'Development',
      description: {
        content: 'Restarts the bot.',
      },
      ownerOnly: true,
    });
  }

  async exec(message) {
    await message.channel.send('Restarting bot. Please wait..').then(() => {
      process.exit();
    });
  }
}

module.exports = Restart;
