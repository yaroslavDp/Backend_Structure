const joi = require('joi');
const userPost = joi.object({
    id: joi.string().uuid(),
    type: joi.string().required(),
    email: joi.string().email().required(),
    phone: joi.string().pattern(/^\+?3?8?(0\d{9})$/).required(),
    name: joi.string().required(),
    city: joi.string(),
}).required();

const userGet = joi.object({
    id: joi.string().uuid(),
}).required();

const userPut = joi.object({
    email: joi.string().email(),
    phone: joi.string().pattern(/^\+?3?8?(0\d{9})$/),
    name: joi.string(),
    city: joi.string(),
}).required();
  
module.exports = {userPost, userGet, userPut};