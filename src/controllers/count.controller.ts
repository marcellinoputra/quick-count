import { Request, Response } from 'express';
import { CountingServiceImpl } from '../services/count.service';

export class CountController {
  /**
   * GET /v1/count
   * @summary Get Count
   * @tags Count
   * @security BasicAuth | BearerAuth
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async getCount(req: Request, res: Response) {
    const countService = new CountingServiceImpl();

    const [responseModelWithData, responseWhenError] =
      await countService.getCount();

    if (responseWhenError.error) {
      return res.status(responseWhenError.status).json({
        status: responseWhenError.status,
        message: responseWhenError.message,
      });
    } else {
      return res.status(responseModelWithData.status).json({
        status: responseModelWithData.status,
        data: responseModelWithData.data,
        message: responseModelWithData.message,
      });
    }
  }
}
