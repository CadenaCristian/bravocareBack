const express = require("express");
const router = express.Router();
const DbConnect = require("../services/db.services");


router.get("/:id", async (req, res, next) => {
  const service = new DbConnect();
  let nurseArray = [];
  const resp = await service.connectDb(`select * from clinician_work_history where facility_id = ${req.params.id}`);
  if (resp.length > 0) {
    const nurse = resp.map((object) => {return object.nurse_id});
    const max = Math.max(...nurse);
    console.log("MAXIMO: ", max)
    resp.map((pos) => {
      if (pos.worked_shift == true) pos.score = 1;
      if (pos.call_out == true) pos.score = -3;
      if (pos.no_call_no_show == true) pos.score = -5;
    });
    for(let i = 1; i <= max; i++){
        let arrToReduce = resp.filter((pos) => pos.nurse_id == i);
        let result = arrToReduce.reduce(function (acc, obj) { return acc + obj.score; }, 0);
        nurseArray.push({ nurse_id: i, score: result })
    }
    nurseArray.sort((a,b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0))
  }
  res.json({ message: "Success", data: nurseArray });
});

module.exports = router;
