const joi = require('joi');
const transactionSchema = joi.object({
  id: joi.string().uuid(),
  userId: joi.string().uuid().required(),
  cardNumber: joi.string().required(),
  amount: joi.number().min(0).required(),
}).required();

module.exports = {transactionSchema};
