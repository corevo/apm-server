import './config';
import 'isomorphic-fetch';
import express from 'express';
import morgan from 'morgan';
import packages from './controllers/package';
import { InitializeRepository } from './models/package';

const debug = require('debug')('application');
const app = express();

app.use(morgan('combined'));

app.use('/api/packages', packages);

app.get('/', (req, res) => {
  res.send('hello there');
});

InitializeRepository().then(() => {
  app.listen(process.env.PORT, () => {
    debug("listening on %s", process.env.PORT);
  });
}).catch((err) => {
  throw new Error(err);
});
