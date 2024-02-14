import { Request, Response } from 'express';
import { PemilihServiceImpl } from '../services/pemilih.service';
import { pemilihForm } from '../dto/pemilih.dto';
import Joi from 'joi';

export class PemilihController {
  public async getPemilih(req: Request, res: Response) {
    const pemilihService = new PemilihServiceImpl();

    const [responseModelWithData, responseModelWhenError] =
      await pemilihService.getPemilih();

    if (responseModelWhenError.error) {
      return res.status(responseModelWhenError.status).json({
        status: responseModelWhenError.status,
        message: responseModelWhenError.message,
      });
    } else {
      return res.status(responseModelWithData.status).json({
        status: responseModelWithData.status,
        data: responseModelWithData.data,
        message: responseModelWithData.message,
      });
    }
  }

  public async createPemilih(req: Request, res: Response) {
    const pemilihData: pemilihForm = {
      ...req.body,
    };
    const pemilihService = new PemilihServiceImpl();

    const schema = Joi.object()
      .keys({
        nama_pemilih: Joi.string().min(8).required().messages({
          'string.min': 'Nama Pemilih Harus Memiliki 8 Characters',
          'any.required': 'Nama Pemilih Tidak Boleh Kosong',
        }),
      })
      .unknown(true);

    const { error, value } = schema.validate(req.body);

    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join(','),
        error: true,
      });
    } else {
      const [responseModelOnlyMessage, responseModelWhenError] =
        await pemilihService.createPemilih(pemilihData);
      if (responseModelWhenError.error) {
        return res.status(responseModelWhenError.status).json({
          status: responseModelWhenError.status,
          message: responseModelWhenError.message,
        });
      } else {
        return res.status(responseModelOnlyMessage.status).json({
          status: responseModelOnlyMessage.status,
          message: responseModelOnlyMessage.message,
        });
      }
    }
  }

  public async updatePilihan(req: Request, res: Response) {
    const pilihanForm: pemilihForm = {
      ...req.body,
    };
    const { id } = req.params;

    const pilihanService = new PemilihServiceImpl();

    const schema = Joi.object()
      .keys({
        pilihan_user: Joi.string().required().messages({
          'any.required': 'Pilihan User Tidak Boleh Kosong',
        }),
      })
      .unknown(true);

    const { error, value } = schema.validate(req.body);

    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        mesasage: error?.details.map((e) => e.message).join(','),
        error: true,
      });
    } else {
      const [responseModelOnlyMessage, responseModelWhenError] =
        await pilihanService.updatePilihan(pilihanForm, Number(id));
      if (responseModelWhenError.error) {
        return res.status(responseModelWhenError.status).json({
          status: responseModelWhenError.status,
          message: responseModelWhenError.message,
        });
      } else {
        return res.status(responseModelOnlyMessage.status).json({
          status: responseModelOnlyMessage.status,
          message: responseModelOnlyMessage.message,
        });
      }
    }
  }
}
