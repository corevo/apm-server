import './config';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('hello there');
});

app.listen(process.env.PORT, () => {
  console.log("listening on %s", process.env.PORT);
});
