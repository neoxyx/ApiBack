require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/catapi',
  CAT_API_KEY: process.env.CAT_API_KEY || 'live_JBT0Ah0Nt12iyl2IpjQVLDWjcLk0GQwf4zI9wBMfmfejKmcC31mOJp4yJz5TsOUP',
  CAT_API_URL: process.env.CAT_API_URL || 'https://api.thecatapi.com/v1'
};