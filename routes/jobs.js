const express = require("express");
const router = express.Router();
const DbConnect = require("../services/db.services");

router.get("/q4", async (req, res, next) => {
  let nurse_neded = [];
  const service = new DbConnect();
  console.log("entre a jobs");
  const jobs = await service.connectDb(
    "select * from jobs order by job_id ASC"
  );
  const nurse_job = await service.connectDb(
    "select * from nurse_hired_jobs ORDER BY job_id ASC"
  );
  jobs.map((pos) => {
    let arr = nurse_job.filter((e) => e.job_id == pos.job_id);
    nurse_neded.push({
      job_id: pos.job_id,
      nurses: pos.total_number_nurses_needed - arr.length,
    });
  });
  res.json({ message: "Success", data: nurse_neded });
});

router.get("/q5", async (req, res, next) => {
  let nurse_neded = [];
  const service = new DbConnect();
  const nurses = await service.connectDb("select * from nurses");
  const jobs = await service.connectDb("select * from jobs");
  const nurse_hired_jobs = await service.connectDb(
    "select * from nurse_hired_jobs"
  );
  nurses.map((pos) => {
    let arr = jobs.filter((e) => e.nurse_type_needed === pos.nurse_type);
    if (arr !== undefined) {
      pos.count_rol = arr.length;
      nurse_neded.push(pos);
    } else {
      pos.count_rol = 0;
      nurse_neded.push(pos);
    }
  });
  nurse_neded.map((pos) => {
    let arr = nurse_hired_jobs.filter((e) => e.nurse_id === pos.nurse_id);
    pos.count_rol = pos.count_rol - arr.length;
  });
  nurse_neded.sort((a, b) =>
    a.nurse_id > b.nurse_id ? 1 : b.nurse_id > a.nurse_id ? -1 : 0
  );
  res.json({ message: "Success", data: nurse_neded });
});

router.get("/q6", async (req, res, next) => {
  let jobs_id = [];
  let nurse_id_arr = [];
  const service = new DbConnect();
  const jobs = await service.connectDb("select * from jobs;");
  const nurse_hired_jobs = await service.connectDb(
    "select * from nurse_hired_jobs ORDER BY nurse_id ASC"
  );
  nurse_hired_jobs.map((pos) => {
    if (!nurse_id_arr.includes(pos.nurse_id)) {
      nurse_id_arr.push(pos.nurse_id);
      jobs_id.push({ nurse_id: pos.nurse_id, job_id: [pos.job_id] });
    } else {
      let position = jobs_id.findIndex((e) => e.nurse_id === pos.nurse_id);
      jobs_id[position]?.job_id.push(pos.job_id);
    }
  });
  jobs.map((pos) => {
    let position = jobs_id.findIndex((e) => e.job_id.includes(pos.job_id));
    if (jobs_id[position].facilities) {
      jobs_id[position].facilities.push(pos.facility_id);
      jobs_id[position].total_facilities =
        jobs_id[position].total_facilities + 1;
    } else {
      jobs_id[position].facilities = [pos.facility_id];
      jobs_id[position].total_facilities = 1;
    }
  });
  jobs_id.sort((a, b) =>
    a?.total_facilities < b?.total_facilities ? 1 : b?.total_facilities < a?.total_facilities ? -1 : 0
  );
  const nures_data = await service.connectDb(`select * from nurses where nurse_id in (${jobs_id[0].nurse_id},${jobs_id[1].nurse_id},${jobs_id[2].nurse_id});`);
  res.json({ message: "Success", data: nures_data });
});

module.exports = router;
