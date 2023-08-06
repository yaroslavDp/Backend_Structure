const { router: userRoutes }  = require("./userRoutes");
const {router: transRoutes} = require('./transactionRoutes');
const {router: eventsRoutes} = require("./eventsRoutes");
const {router: betsRoutes} = require('./betsRoutes');
const {router: statsRoutes} = require('./statsRoutes');
const {router: healthRoutes} = require('./healthRoutes');

const initRoutes = (app) => {
    app.use('/users', userRoutes);
    app.use('/transactions', transRoutes);
    app.use('/events', eventsRoutes);
    app.use('/bets', betsRoutes);
    app.use('/stats', statsRoutes);
    app.use('/health', healthRoutes);
}

module.exports = {initRoutes};