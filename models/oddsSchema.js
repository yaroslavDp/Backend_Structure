const joi = require('joi');
const oddsSchema = joi.object({
      homeWin: joi.number().min(1.01).required(),
      awayWin: joi.number().min(1.01).required(),
      draw: joi.number().min(1.01).required(),
}).required()

module.exports = {oddsSchema}