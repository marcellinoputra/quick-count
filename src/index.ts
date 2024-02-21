import express, { Express } from 'express';
import dotenv from 'dotenv';
import Routes from './routes/routes';
import { PrismaClient } from '@prisma/client';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import { optionsSwagger } from './vendor/swagger/swagger_client';
dotenv.config();

const app: Express = express();
const port = 3500;
const prisma = new PrismaClient();

Routes(app);

expressJSDocSwagger(app)(optionsSwagger);
app.use('/v1/core/images/partai', express.static('images/partai'));

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
