import { Express } from 'express';
import { PartaiController } from '../../controllers/partai.controller';
import multer from 'multer';
import { middlewareAuth } from '../../middleware/auth';

enum PartaiR {
  getPartai = '/v1/partai',
  createPartai = '/v1/partai',
  updatePartai = '/v1/partai',
}

export default function PartaiRoutes(
  app: Express,
  partaiController: PartaiController,
  upload: multer.Multer,
  middlewareJwt: middlewareAuth
) {
  app.get(
    PartaiR.getPartai,
    partaiController.getPartai,
    middlewareJwt.authenticationToken
  );
  app.post(
    PartaiR.createPartai,
    upload.single('logo_partai'),
    partaiController.createPartai,
    middlewareJwt.authenticationToken
  );
  app.put(
    PartaiR.updatePartai,
    upload.single('logo_partai'),
    partaiController.updatePartai,
    middlewareJwt.authenticationToken
  );
}
