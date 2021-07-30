const { Listener } = require('discord-akairo');

class MissingPermissions extends Listener {
  constructor() {
    super('missingPermissions', {
      emitter: 'commandHandler',
      event: 'missingPermissions',
    });
  }

  async exec(message) {
    const msg = await message.channel.send(
      'You do not have permission to use this command.'
    );
    setTimeout(function () {
      msg.delete();
      message.delete();
      return;
    }, 5000);
    return;
  }
}

module.exports = MissingPermissions;
