import cors from 'cors';
import { config } from 'dotenv';
import express, { json } from 'express';
import { defaultErrorHandler } from './modules/error/middlewares';
import userRouter from './modules/user/routes';
import categoryRouter from './modules/category/routes';
import productRouter from './modules/product/routes';

config();

// env
const isProduction = process.env.NODE_ENV === 'production';
const frontendURL = isProduction
  ? process.env.PRODUCTION_FRONTEND_URL
  : process.env.DEVELOPMENT_FRONTEND_URL;

const corsOptions = {
  origin: frontendURL,
  credentials: true, // access-control-allow-credentials:true
  allowedHeaders: ['Content-Type', 'Authorization'], // access-control-allow-headers
  optionSuccessStatus: 200,
};

const app = express();
const PORT_SERVER = process.env.PORT_SERVER ?? 4000;
app.use(cors(corsOptions));
app.use(json());

// middleware
// this is for logging
// app.all('*', (req, res, next) => {
//   console.log('Time', Date.now());
//   console.log(req);
//   next();
// });

// route
app.get('/', (req, res) => {
  res.send('This is home page');
});

app.use('/user', userRouter);

app.use('/category', categoryRouter);

app.use('/product', productRouter);

// error handler
app.use(defaultErrorHandler);

// port
app.listen(PORT_SERVER, () => {
  console.log(`Server is running on http://localhost:${PORT_SERVER}`);
});
