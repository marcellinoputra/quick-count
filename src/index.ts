import express, { Express } from 'express';
import dotenv from 'dotenv';
import Routes from './routes/routes';
import { PrismaClient } from '@prisma/client';
dotenv.config();

const app: Express = express();
const port = 3500;
const prisma = new PrismaClient();

Routes(app);

app.listen(port, () => {
  prisma
    .$connect()
    .then(() => {
      console.log('Database is Connected');
    })
    .catch((err) => {
      console.log(`Database is Not Connected Because: ${err}`);
    });

  console.log(`Server Running on Port ${port}`);
});
