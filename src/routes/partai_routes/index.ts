import { Express } from 'express';
import { PartaiController } from '../../controller/partai.controller';
import multer from 'multer';

enum PartaiR {
  getPartai = '/v1/partai',
  createPartai = '/v1/partai',
}

export default function PartaiRoutes(
  app: Express,
  partaiController: PartaiController,
  uploadPartai: multer.Multer
) {
  app.get(PartaiR.getPartai, partaiController.getPartai);
  app.post(
    PartaiR.createPartai,
    partaiController.createPartai,
    uploadPartai.single('img_partai')
  );
}
