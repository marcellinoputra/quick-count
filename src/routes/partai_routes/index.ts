import { Express } from 'express';
import { PartaiController } from '../../controller/partai.controller';
import multer from 'multer';

enum PartaiR {
  getPartai = '/v1/partai',
  createPartai = '/v1/partai',
  updatePartai = '/v1/partai',
}

export default function PartaiRoutes(
  app: Express,
  partaiController: PartaiController,
  upload: multer.Multer
) {
  app.get(PartaiR.getPartai, partaiController.getPartai);
  app.post(
    PartaiR.createPartai,
    upload.single('logo_partai'),
    partaiController.createPartai
  );
  app.put(
    PartaiR.updatePartai,
    partaiController.updatePartai
    // upload.single('logo_partai')
  );
}
