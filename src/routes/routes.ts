import bodyParser from 'body-parser';
import { Express, Request, Response } from 'express';
import cors from 'cors';
import { AuthController } from '../controller/auth.controller';
import AuthRoutes from './auth_routes';
import { PemilihController } from '../controller/pemilih.controller';
import PemilihRoutes from './pemilih_routes';
import { PartaiController } from '../controller/partai.controller';
import PartaiRoutes from './partai_routes';
import multer, { diskStorage } from 'multer';

export default function Routes(app: Express) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', function (req: Request, res: Response) {
    res.status(200).json({
      message: 'Connected',
    });
  });

  const uploadPartai = multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        callback(null, 'images/partai');
      },
      filename(req, file, callback) {
        const getMonth = new Date().getMonth() + 1;
        const getDay = new Date().getDate();
        const randomString5Length = Math.random().toString(36).substring(2, 15);

        const getPathExt = file.originalname.split('.')[1];
        callback(
          null,
          file.fieldname +
            '_' +
            randomString5Length +
            '_' +
            getDay +
            '' +
            getMonth +
            '.' +
            getPathExt
        );
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter(req, file, callback) {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return callback(new Error('Only Image or Webp Files are allowed!'));
      }
      callback(null, true);
    },
  });

  const authController = new AuthController();
  const pemilihController = new PemilihController();
  const partaiController = new PartaiController();

  AuthRoutes(app, authController);
  PemilihRoutes(app, pemilihController);
  PartaiRoutes(app, partaiController, uploadPartai);
}
