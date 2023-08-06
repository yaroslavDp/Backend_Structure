const { userRepository } = require('../repositories/userRepository');
const {eventsRepository} = require('../repositories/eventsRepository');
const {modifyKeys} = require('../utils/modifyKeys');
const {statEmitter} = require('../utils/eventEmitter');
const {betsSchema} = require('../models/betsSchema');
const {betsRepository} = require('../repositories/betsRepository');

class BetsService {
    async createBet(userId, data) {
        const { value, error } = betsSchema.validate(data);
        if (error) {
            const err = new Error(error.details[0].message);
            err.code = 400
            throw err;
        }
        const { eventId, betAmount, ...newValue } = value;
        const myBet = {
            ...newValue,
            event_id: eventId,
            bet_amount: betAmount,
            user_id: userId,
        };

        const user = await userRepository.getUserById(userId);
        if(!user){
            const err = new Error('User does not exist');
            err.code = 400
            throw err;
        }
        if(+user.balance < +myBet.bet_amount) {
            const err = new Error('Not enough balance');
            err.code = 400
            throw err;
        }
        const [event] = await eventsRepository.getById('event', myBet.event_id);
        if(!event) {
            const err = new Error('Event not found');
            err.code = 400
            throw err;
          }
        const [odds] = await eventsRepository.getById('odds', event.odds_id);
        if(!odds) {
            const err = new Error('Odds not found');
            err.code = 400
            throw err;
        }
        let multiplier;
        switch(myBet.prediction) {
            case 'w1':
                multiplier = odds.home_win;
                break;
            case 'w2':
                multiplier = odds.away_win;
                break;
            case 'x':
                multiplier = odds.draw;
                break;
        }

        const [betResult] = await betsRepository.insertBet({...myBet, multiplier, event_id: event.id});
        const currentBalance = user.balance - myBet.bet_amount;
        await userRepository.updateUserBalance(userId, {balance: currentBalance});
        
        statEmitter.emit('newBet');
        modifyKeys(['bet_amount', 'event_id', 'away_team', 'home_team', 'odds_id', 'start_at', 'updated_at', 'created_at'], betResult);
        return {
            ...betResult,
            currentBalance,
        };
    }
}

const betsService = new BetsService();
module.exports = {betsService}