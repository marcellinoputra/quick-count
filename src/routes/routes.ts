import bodyParser from 'body-parser';
import { Express, Request, Response } from 'express';
import cors from 'cors';
import { AuthController } from '../controller/auth.controller';
import AuthRoutes from './auth_routes';
import { PemilihController } from '../controller/pemilih.controller';
import PemilihRoutes from './pemilih_routes';
import { PartaiController } from '../controller/partai.controller';
import PartaiRoutes from './partai_routes';

export default function Routes(app: Express) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', function (req: Request, res: Response) {
    res.status(200).json({
      message: 'Connected',
    });
  });

  const authController = new AuthController();
  const pemilihController = new PemilihController();
  const partaiController = new PartaiController();

  AuthRoutes(app, authController);
  PemilihRoutes(app, pemilihController);
  PartaiRoutes(app, partaiController);
}
