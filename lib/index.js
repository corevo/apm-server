import './config';
import 'isomorphic-fetch';
import express from 'express';
import morgan from 'morgan';
import packages from './controllers/package';

const app = express();

app.use(morgan('combined'));

app.use('/api/packages', packages);

app.get('/', (req, res) => {
  res.send('hello there');
});

app.listen(process.env.PORT, () => {
  console.log("listening on %s", process.env.PORT);
});
