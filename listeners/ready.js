const { Listener } = require('discord-akairo');
const mongo = require('../structures/mongo.js');
require('../structures/port.js')();

class Ready extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  async exec() {
    await mongo().then(() => {
      console.log('Connected to the database.');
    });

    console.log(`Logged in as ${this.client.user.tag}!`);

    const WoN = this.client.guilds.cache.get(process.env.main);
    this.client.user.setPresence({
      activity: {
        name: `${WoN.memberCount.toLocaleString()} members.`,
        type: 'WATCHING',
      },
      status: 'idle',
    });
  }
}

module.exports = Ready;
