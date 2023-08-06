const { userService } = require("../services/userService");
const { Router } = require('express');
const {authMiddleware} = require('../middlewares/authMiddleware');

const router = Router();

router.get("/:id", async (req, res) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      return res.send(user);
    } catch (err) {
        if(err.code == '400'){
            return res.status(400).send({ error: err.message });
        }
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
  });
  
router.post("/", async (req, res) => {
    try {
        const result = await userService.createUser(req.body);
        return res.send(result);
    } catch (err) {
        if (err.code == '23505') {
        return res.status(400).send({ error: err.detail });
        } else if(err.code == '400') {
            return res.status(400).send({ error: err.message });
        }
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
});
  
router.put("/:id", authMiddleware, async (req, res) => {
    try {
      const result = await userService.updateUser(req.params.id, req.body, req.user.id);
      return res.send(result);
    } catch (err) {
      if (err.code == '23505') {
        console.log(err);
        return res.status(400).send({ error: err.detail });
      }
      if(err.code == '401'){
        return res.status(401).send({ error: err.message });
      }
      if(err.code == '400'){
        return res.status(400).send({ error: err.message });
      }
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
});

module.exports = { router }