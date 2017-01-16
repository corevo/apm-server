require('dotenv').config();
require('debug').enable(process.env.DEBUG);

if (!process.env.PORT) {
  console.error('Please rename .env.sample to .env, and configure it accordingly'); // eslint-disable-line no-console
  process.exit(1);
}
