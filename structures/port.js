const port = () => {
  const app = require('express')();

  app.all('/', (req, res) => res.send('Nether Bot.'));
  app.listen(3000, () => console.log('Listening at http://localhost:3000.'));
};

module.exports = port;
