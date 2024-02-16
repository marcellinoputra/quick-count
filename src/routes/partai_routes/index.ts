import { Express } from 'express';
import { PartaiController } from '../../controller/partai.controller';

enum PartaiR {
  getPartai = '/v1/partai',
  createPartai = '/v1/partai',
}

export default function PartaiRoutes(
  app: Express,
  partaiController: PartaiController
) {
  app.get(PartaiR.getPartai, partaiController.getPartai);
  app.post(PartaiR.createPartai, partaiController.createPartai);
}
