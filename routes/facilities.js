const express = require('express');
const router = express.Router();
const DbConnect = require('../services/db.services');


router.get('/', async(req, res, next) => {
  const service = new DbConnect();
  console.log("entre a facilities")
  const resp = await service.connectDb('SELECT * FROM facilities;');
  res.json({message: "Success", data: resp});
});

module.exports = router;
