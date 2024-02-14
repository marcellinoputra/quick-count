import { Express } from 'express';
import { PemilihController } from '../../controller/pemilih.controller';

enum PemilihR {
  getPemilih = '/v1/pemilih',
  createPemilih = '/v1/pemilih',
}

export default function PemilihRoutes(
  app: Express,
  pemilihController: PemilihController
) {
  app.get(PemilihR.getPemilih, pemilihController.getPemilih);
  app.post(PemilihR.createPemilih, pemilihController.createPemilih);
}
