const { Router } = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');
const { eventsService }  = require("../services/eventsService");
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(401).send({ error: 'Not Authorized' });
        }
        const result = await eventsService.createEvent(req.body);
        return res.send(result);
    } catch (err) {
        if(err.code == '400'){
            return res.status(400).send({ error: err.message });
        }
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
});
router.put('/:id', authMiddleware, async(req,res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(401).send({ error: 'Not Authorized' });
        }
        const result = await eventsService.updateEvent(req.params.id, req.body);
        setTimeout(() => {
            return res.send(result);
        }, 1000)
    } catch (err) {
        if(err.code == '400'){
            return res.status(400).send({ error: err.message });
        }
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
});
  
module.exports = { router };