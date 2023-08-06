const {db} = require('../db/db');

class BetsRepository {

    insertBet(data){
        return db('bet').insert(data).returning('*');
    }
    getBets(eventId){
        return db('bet').where('event_id', eventId).andWhere('win', null);
    }
    updateBets(id, data){
        return db('bet').where('id', id).update(data);
    }
}
const betsRepository = new BetsRepository();
module.exports = { betsRepository }