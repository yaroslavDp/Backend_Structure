const { userRepository } = require('../repositories/userRepository');
const {eventsRepository} = require('../repositories/eventsRepository');
const {modifyKeys} = require('../utils/modifyKeys');
const {statEmitter} = require('../utils/eventEmitter');
const {postEvent, updEvent} = require('../models/eventsSchema');
const {betsRepository} = require('../repositories/betsRepository');


class EventsService {
    async createEvent(data) {
        const { value, error } = postEvent.validate(data);
        if (error) {
            const err = new Error(error.details[0].message);
            err.code = 400
            throw err;
        }
        const { odds, awayTeam, homeTeam, startAt, ...newValue } = value;
        const myOdds = {
            home_win: odds.homeWin,
            away_win: odds.awayWin,
            draw: odds.draw,
        };
        const [oddsResult] = await eventsRepository.insert('odds', myOdds)
        
        const event = {
            ...newValue,
            away_team: awayTeam,
            home_team: homeTeam,
            start_at: startAt,
            odds_id: oddsResult.id,
        };
    
        const [eventResult] = await eventsRepository.insert('event', event);
        statEmitter.emit('newEvent');
        modifyKeys(['bet_amount', 'event_id', 'away_team', 'home_team', 'odds_id', 'start_at', 'updated_at', 'created_at'], eventResult)
        modifyKeys(['home_win', 'away_win', 'created_at', 'updated_at'], oddsResult)
        return {
            ...eventResult,
            odds: oddsResult,
        };
    }
    async updateEvent(eventId, data){
        const { value, error } = updEvent.validate(data);
        if (error) {
            const err = new Error(error.details[0].message);
            err.code = 400
            throw err;
        }

        const [bets] = await betsRepository.getBets(eventId);
        const [w1, w2] = value.score.split(":");
        let result;
        if(+w1 > +w2) {
            result = 'w1'
        } else if(+w2 > +w1) {
            result = 'w2';
        } else {
            result = 'x';
        }
        const [eventResult] = await eventsRepository.updateById(eventId, { score: value.score});
        await Promise.all([bets].map(async (bet) => {
            if (bet.prediction === result) {
              await betsRepository.updateBets(bet.id, {
                win: true
              });
              const user = await userRepository.getUserById(bet.user_id);
              if (user) {
                const newBalance = user.balance + (bet.bet_amount * bet.multiplier);
                await userRepository.updateUserBalance(bet.user_id, newBalance);
              }
            } else if (bet.prediction !== result) {
                await betsRepository.updateBets(bet.id, {
                    win: false
                });
            }
        }));
        modifyKeys(['bet_amount', 'event_id', 'away_team', 'home_team', 'odds_id', 'start_at', 'updated_at', 'created_at'], eventResult)
        return {
            ...eventResult
        }
    }
}

const eventsService = new EventsService();
module.exports = {eventsService}