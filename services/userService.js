const { userRepository } = require('../repositories/userRepository');
const { userGet, userPost, userPut } = require('../models/userSchema');
const {signToken} = require('../utils/jwtUtil');
const {statEmitter} = require('../utils/eventEmitter');

class UserService {

    async getUserById(id) {
        const { value, error } = userGet.validate({id});
        if (error) {
            const err = new Error(error.details[0].message);
            err.code = 400
            throw err;
        }
        return await userRepository.getUserById(id);
    }
      
    async createUser(userData) {
        const { value, error } = userPost.validate(userData);
        if (error) {
            const err = new Error(error.details[0].message);
            err.code = 400
            throw err;
        }
    
        const user = {
            ...value,
            balance: 0,
        };
    
        const [result] = await userRepository.insertUser(user);
        statEmitter.emit('newUser');
        const { created_at, updated_at, ...newResult } = result;
        return {
            ...newResult,
            createdAt: created_at,
            updatedAt: updated_at,
            accessToken: signToken({ id: result.id, type: result.type }),
        };
    }
      
    async updateUser(id, updates, userIdFromToken) {
        if (id !== userIdFromToken) {
          const err = new Error('UserId mismatch');
          err.code = 401
          throw err;
        }
      
        const { value, error } = userPut.validate(updates);
        if (error) {
          const err = new Error(error.details[0].message);
          err.code = 400
          throw err;
        }
      
        const [result] = await userRepository.updateUser(id, value);
        return {
          ...result,
        };
    }
}
const userService = new UserService();

module.exports = { userService }