const {db} = require('../db/db');

class TransactionRepository {

    insertTransaction(transaction){
        return db('transaction').insert(transaction).returning('*');
    }
}
const transRepository = new TransactionRepository();
module.exports = { transRepository }