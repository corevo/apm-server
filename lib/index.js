import './config';
import 'isomorphic-fetch';
import express from 'express';
import packages from './controllers/package';

const app = express();

app.use('/api/packages', packages);

app.get('/', (req, res) => {
  res.send('hello there');
});

app.listen(process.env.PORT, () => {
  console.log("listening on %s", process.env.PORT);
});
