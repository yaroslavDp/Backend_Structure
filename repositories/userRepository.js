const {db} = require('../db/db');

class UserRepository {

    getUserById(id){
        return db('user').where('id', id).first();
    }
    insertUser(user){
        return db('user').insert(user).returning('*');
    }
    updateUser(id, updates){
        return db('user').where('id', id).update(updates).returning('*');
    }
    updateUserBalance(id, balance){
        return db('user').where('id', id).update(balance);
    }
}
const userRepository = new UserRepository();
module.exports = { userRepository }