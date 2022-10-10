const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const whitelist = ['http://localhost:8080', 'http://localhost:3000'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));
app.use('/facilities', require('./routes/facilities'))
app.use('/history', require('./routes/clinicalHistory'))
app.use('/jobs', require('./routes/jobs'))

app.listen(port, () => {
  console.log('Mi port' +  port);
});
