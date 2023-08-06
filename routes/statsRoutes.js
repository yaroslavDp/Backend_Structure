const { Router } = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');
const { stats } = require("../utils/eventEmitter");
const router = Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.type !== 'admin') {
            return res.status(401).send({ error: 'Not Authorized' });
        }
        res.send(stats);
      } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
});
  
module.exports = { router };