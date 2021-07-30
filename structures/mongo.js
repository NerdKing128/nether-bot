const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect(process.env.mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    keepAlive: true,
  });

  return mongoose;
};
