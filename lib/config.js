require('dotenv').config();

if (!process.env.PORT) {
  console.error('Please rename .env.sample to .env, and configure it accordingly');
  process.exit(1);
}
