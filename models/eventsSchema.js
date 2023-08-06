const joi = require('joi');
const {oddsSchema} = require('./oddsSchema');
const postEvent = joi.object({
    id: joi.string().uuid(),
    type: joi.string().required(),
    homeTeam: joi.string().required(),
    awayTeam: joi.string().required(),
    startAt: joi.date().required(),
    odds: oddsSchema
}).required();

const updEvent = joi.object({
    score: joi.string().required(),
}).required();

module.exports = {postEvent, updEvent};