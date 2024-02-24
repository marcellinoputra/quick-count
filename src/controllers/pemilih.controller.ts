import { Request, Response } from 'express';
import { PemilihServiceImpl } from '../services/pemilih.service';
import { pemilihForm } from '../dto/pemilih.dto';
import Joi from 'joi';

const pemilihService = new PemilihServiceImpl();

export class PemilihController {
  /**
   * GET /v1/pemilih
   * @summary Get Data Pemilih
   * @tags Pemilih
   * @security BasicAuth | BearerAuth
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async getPemilih(req: Request, res: Response) {
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

  /**
   * POST /v1/pemilih
   * @summary Create Pemilih
   * @tags Pemilih
   * @param {string} nama_pemilih.form.required - form data - application/x-www-url-encoded
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async createPemilih(req: Request, res: Response) {
    const pemilihData: pemilihForm = {
      ...req.body,
    };

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

  /**
   * PUT /v1/pemilih/{id}
   * @summary Update Pilihan User
   * @tags Pemilih
   * @param {number} id.path
   * @param {string} pilihan_user.form.required - form data - application/x-www-form-urlencoded
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async updatePilihan(req: Request, res: Response) {
    const pilihanForm: pemilihForm = {
      ...req.body,
    };
    const { id } = req.params;

    const schema = Joi.object()
      .keys({
        pilihan_user: Joi.number().required().messages({
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
        await pemilihService.updatePilihan(pilihanForm, Number(id));
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
