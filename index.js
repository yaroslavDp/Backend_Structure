const express = require("express");
const {stats, statEmitter } = require('./utils/eventEmitter');
const {initRoutes} = require('./routes/routes');
const app = express();

const port = 3000;


app.use(express.json());
// app.use((uselessRequest, uselessResponse, neededNext) => {
//   // db = knex(dbConfig.development);
//   db.raw('select 1+1 as result').then(function () {
//     neededNext();
//   }).catch(() => {
//     throw new Error('No db connection');
//   });
// });

initRoutes(app);

const server = app.listen(port, () => {
  statEmitter.on('newUser', () => {
    stats.totalUsers++;
  });
  statEmitter.on('newBet', () => {
    stats.totalBets++;
  });
  statEmitter.on('newEvent', () => {
    stats.totalEvents++;
  });

  console.log(`App listening at http://localhost:${port}`);
});

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    process.exit(0);
  });
});
// Do not change this line
module.exports = { app, server };
