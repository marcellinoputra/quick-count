import { Request, Response } from 'express';
import { PartaiServiceImpl } from '../services/partai.service';
import { PartaiForm } from '../dto/partai.dto';
import Joi from 'joi';

export class PartaiController {
  public async getPartai(req: Request, res: Response) {
    const partaiService = new PartaiServiceImpl();

    const [responseModelWithData, responseModelWhenError] =
      await partaiService.getPartai();

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

  public async createPartai(req: Request, res: Response) {
    const createPartaiForm: PartaiForm = req.body;
    const partaiService = new PartaiServiceImpl();

    const schema = Joi.object()
      .keys({
        singkatan_partai: Joi.string().min(3).required().messages({
          'string.min': 'Singkatan Partai Harus Memiliki 3 Characters',
          'any.required': 'Singkatan Partai Tidak Boleh Kosong',
        }),
        nama_partai: Joi.string().min(10).required().messages({
          'string.min': 'Nama Partai Harus Memiliki 10 Characters',
          'any.required': 'Nama Partai Tidak Boleh Kosong',
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
        await partaiService.createPartai(createPartaiForm);
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

  public async updatePartai(req: Request, res: Response) {
    const updateForm: PartaiForm = {
      ...req.body,
    };

    const { id } = req.params;

    const partaiService = new PartaiServiceImpl();

    const schema = Joi.object()
      .keys({
        singkatan_partai: Joi.string().min(3).required().messages({
          'string.min': 'Singkatan Partai Harus Memiliki 3 Characters',
          'any.required': 'Singkatan Partai Tidak Boleh Kosong',
        }),
        nama_partai: Joi.string().min(10).required().messages({
          'string.min': 'Nama Partai Harus Memiliki 10 Characters',
          'any.required': 'Nama Partai Tidak Boleh Kosong',
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
      const [responseModelOnlyMessage, responseWhenError] =
        await partaiService.updatePartai(req.body, Number(id));
      if (responseWhenError.error) {
        res.status(responseWhenError.status).json({
          status: responseWhenError.status,
          message: responseWhenError.message,
        });
      } else {
        res.status(responseModelOnlyMessage.status).json({
          status: responseModelOnlyMessage.status,
          message: responseModelOnlyMessage.message,
        });
      }
    }
  }
}
