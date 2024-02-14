import { error } from 'console';
import {
  ResponseModelOnlyMessage,
  ResponseModelWithData,
  ResponseWhenError,
} from '../constant/response_model';
import { prisma } from '../database/db';
import { pemilihForm } from '../dto/pemilih.dto';
import jwt from 'jsonwebtoken';

export class PemilihServiceImpl {
  public async getPemilih(): Promise<
    [ResponseModelWithData, ResponseWhenError]
  > {
    let responseModelWithData = {} as ResponseModelWithData;
    let responseModelWhenError = {} as ResponseWhenError;

    try {
      await prisma.pemilih
        .findMany({
          orderBy: [
            {
              id: 'desc',
            },
          ],
        })
        .then((data) => {
          responseModelWithData = {
            status: 200,
            data: data,
            message: 'Successfully Get Data Pemilih',
            error: false,
          };
        });
    } catch (err) {
      responseModelWhenError = {
        status: 400,
        message: `${err}`,
        error: true,
      };
    }
    return [responseModelWithData, responseModelWhenError];
  }

  public async createPemilih(
    pemilihForm: pemilihForm
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseModelWhenError = {} as ResponseWhenError;

    try {
      await prisma.pemilih
        .create({
          data: {
            nama_pemilih: pemilihForm.nama_pemilih,
          },
        })
        .then((data) => {
          responseModelOnlyMessage = {
            status: 201,
            message: 'Successfully Create Pemilih',
            error: false,
          };
        });
    } catch (err) {
      responseModelWhenError = {
        status: 400,
        error: true,
        message: `${err}`,
      };
    }

    return [responseModelOnlyMessage, responseModelWhenError];
  }

  public async updatePilihan(
    pemilihForm: pemilihForm,
    id: number
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseModelWhenError = {} as ResponseWhenError;

    try {
      await prisma.pemilih
        .update({
          where: {
            id: Number(id),
          },
          data: {
            pilihan_user: pemilihForm.pilihan_user,
            updatedAt: new Date(),
          },
        })
        .then((data) => {
          responseModelOnlyMessage = {
            status: 201,
            message: 'Succesfully Update Pilihan',
            error: false,
          };
        });
    } catch (err) {
      responseModelWhenError = {
        status: 400,
        message: `${err}`,
        error: true,
      };
    }

    return [responseModelOnlyMessage, responseModelWhenError];
  }
}
