const { Listener } = require('discord-akairo');

class Message extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message',
    });
  }

  exec(message) {}
}

module.exports = Message;
