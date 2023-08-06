const {db} = require('../db/db');

class EventsRepository {

    insert(table, data){
        return db(table).insert(data).returning('*');
    }
    getById(table, id){
        return db(table).where('id', id);
    }
    updateById(id, data){
        return db('event').where('id', id).update(data).returning('*');
    }
}
const eventsRepository = new EventsRepository();
module.exports = { eventsRepository }