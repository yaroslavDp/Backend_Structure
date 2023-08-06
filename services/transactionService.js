const { userRepository } = require('../repositories/userRepository');
const { transRepository } = require('../repositories/transactionRepository');
const {transactionSchema} = require('../models/transactionSchema');
const {modifyKeys} = require('../utils/modifyKeys');

class TransactionService {
    async createTransaction(data) {
        const { value, error } = transactionSchema.validate(data);
        if (error) {
            const err = new Error(error.details[0].message);
            err.code = 400
            throw err;
        }
        const user = await userRepository.getUserById(value.userId);
        if (!user) {
            const err = new Error('User does not exist');
            err.code = 400
            throw err;
        }
        const { cardNumber, userId, ...newValue } = value;
        const transaction = {
            ...newValue,
            card_number: cardNumber,
            user_id: userId,
        };
    
        const [result] = await transRepository.insertTransaction(transaction);
        const currentBalance = value.amount + user.balance;
        await userRepository.updateUserBalance(value.userId, {
            balance: currentBalance,
        })
        modifyKeys(['user_id', 'card_number', 'created_at', 'updated_at'], result)
        return {
            ...result,
            currentBalance,
        };
    }
}

const transService = new TransactionService();
module.exports = {transService}