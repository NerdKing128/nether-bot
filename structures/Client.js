const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require('discord-akairo');
const { Intents } = require('discord.js');
const config = require('../config.json');

class Client extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: config.info.developers,
      },
      {
        intents: Object.keys(Intents.FLAGS),
        partials: ['MESSAGE'],
      }
    );

    this.commandHandler = new CommandHandler(this, {
      directory: './commands/',
      prefix: process.env.prefix,
      handleEdits: true,
      commandUtil: true,
      defaultCooldown: 1000,
      ignoreCooldown: config.info.developers,
      ignorePermissions: config.info.developers,
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: './listeners/',
    });
  }

  init() {
    this.commandHandler.useListenerHandler(this.listenerHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      process: process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  async start() {
    this.config = config;

    await this.init();
    return this.login(process.env.token);
  }
}

module.exports = Client;
