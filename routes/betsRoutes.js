const { Router } = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');
const { betsService }  = require("../services/betsService");
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        if (!req.user.id) {
            return res.status(401).send({ error: 'Not Authorized' });
        }
        const result = await betsService.createBet(req.user.id, req.body);
        return res.send(result);
    } catch (err) {
        if(err.code == '400' || err.code == '404'){
            return res.status(err.code).send({ error: err.message });
        }
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
  });
  
module.exports = { router };