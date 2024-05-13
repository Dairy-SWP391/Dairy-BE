import cors from 'cors';
import { config } from 'dotenv';
import express, { json } from 'express';

config();
const app = express();
const PORT_SERVER = process.env.PORT_SERVER || 4000;

// env
const isProduction = process.env.NODE_ENV === 'production';
const frontendURL = isProduction
  ? process.env.PRODUCTION_FRONTEND_URL
  : process.env.DEVELOPMENT_FRONTEND_URL;

// const databaseURL = isProduction
//   ? process.env.PRODUCTION_DATABASE_URL
//   : process.env.DEVELOPMENT_DATABASE_URL;

// cors
const corsOptions = {
  origin: frontendURL,
  credentials: true, // access-control-allow-credentials:true
  allowedHeaders: ['Content-Type', 'Authorization'], // access-control-allow-headers
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// middleware
// this is for logging
app.all('*', (req, res, next) => {
  console.log('Time', Date.now());
  console.log(req);
  next();
});

// route
app.use('/', (req, res) => {
  res.send('This is home page');
});

// database connect

// error handler

// port
app.listen(PORT_SERVER, () => {
  console.log(`Server is running on http://localhost:${PORT_SERVER}`);
});
