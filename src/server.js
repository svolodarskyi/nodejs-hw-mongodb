import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVar } from './utils/getEnvVar.js';
import contactsRouter from './routers/contacts.js';
import swaggerUIExpress from 'swagger-ui-express';
import path from 'node:path';
import fs from 'node:fs';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';


const PORT = Number(getEnvVar('PORT', '3000'));
const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
);

export const setupServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(pino());

  app.use(
    '/api-docs',
    (req, res, next) => {
      console.log('Request for Swagger UI received');
      next();
    },
    swaggerUIExpress.serve,
    swaggerUIExpress.setup(swaggerDocument),
  );

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.get('/', (req, res) => {
    res.json({
      message: 'Hellow World;',
    });
  });

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    const localUrl = `http://localhost:${PORT}`;
    console.log(`Server is running on port ${PORT}`);
    console.log(`You can access the API documentation at ${localUrl}/api-docs`);
  });
};