import { Express } from 'express';
import { CountController } from '../../controllers/count.controller';

enum CountR {
  getCount = '/v1/count',
}

export default function CountRoutes(
  app: Express,
  countController: CountController
) {
  app.get(CountR.getCount, countController.getCount);
}
