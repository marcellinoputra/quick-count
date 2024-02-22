import { Request, Response } from 'express';
import { PartaiServiceImpl } from '../services/partai.service';
import { PartaiForm } from '../dto/partai.dto';
import Joi from 'joi';

export class PartaiController {
  /**
   * GET /v1/partai
   * @summary Get Partai
   * @tags Partai
   * @security  BasicAuth | BearerAuth
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

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

  /**
   * POST /v1/partai
   * @summary Create Partai
   * @tags Partai
   * @param {string} nama_partai.form.required - form data - multipart/form-data
   * @param {string} singkatan_partai.form.required - form data - multipart/form-data
   * @param {file} logo_partai.form.required - file - multipart/form-data
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async createPartai(req: Request, res: Response) {
    const reqForm: PartaiForm = {
      nama_partai: req.body.nama_partai,
      singkatan_partai: req.body.singkatan_partai,
      logo_partai: req.file?.filename as string,
      createdAt: new Date(),
    };

    const partaiService = new PartaiServiceImpl();
    const [responseModelOnlyMessage, responseWhenError] =
      await partaiService.createPartai(reqForm);

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

    const { error, value } = schema.validate(reqForm);

    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join(','),
        error: true,
      });
    } else {
      if (responseWhenError.error) {
        return res.status(responseWhenError.status).json({
          status: responseWhenError.status,
          message: responseWhenError.message,
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
   * PUT /v1/partai/{id}
   * @summary Update Partai
   * @tags Partai
   * @param {number} id.path
   * @param {string} nama_partai.form.required - form data - multipart/form-data
   * @param {string} singkatan_partai.form.required - form data - multipart/form-data
   * @param {file} logo_partai.form.required - file - multipart/form-data
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

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
        await partaiService.updatePartai(updateForm, Number(id));
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
