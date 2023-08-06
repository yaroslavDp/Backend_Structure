const { Router } = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');
const {transService} = require('../services/transactionService');
const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
      if (req.user.type !== 'admin') {
        return res.status(401).send({ error: 'Not Authorized' });
      }
      const result = await transService.createTransaction(req.body);
      return res.send(result);
    } catch (err) {
      if(err.code == '400'){
        return res.status(400).send({ error: err.message });
      }
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
});

module.exports = { router }