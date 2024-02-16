import { error } from 'console';
import {
  ResponseModelOnlyMessage,
  ResponseModelWithData,
  ResponseWhenError,
} from '../constant/response_model';
import { prisma } from '../database/db';
import { PartaiForm } from '../dto/partai.dto';

export class PartaiServiceImpl {
  public async getPartai(): Promise<
    [ResponseModelWithData, ResponseWhenError]
  > {
    let responseModelWithData = {} as ResponseModelWithData;
    let responseWhenError = {} as ResponseWhenError;

    try {
      await prisma.partai
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
            message: 'Successfully Get Data Partai',
            error: false,
          };
        })
        .catch((err) => {
          responseWhenError = {
            status: 400,
            message: `${err}`,
            error: true,
          };
        });
    } catch (err) {
      responseWhenError = {
        status: 500,
        message: 'Something Went Wrong',
        error: true,
      };
    }

    return [responseModelWithData, responseWhenError];
  }

  public async createPartai(
    partaiForm: PartaiForm
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      await prisma.partai
        .create({
          data: {
            nama_partai: partaiForm.nama_partai,
            singkatan_partai: partaiForm.singkatan_partai,
            logo_partai: partaiForm.logo_partai,
            createdAt: new Date(),
          },
        })
        .then(() => {
          responseModelOnyMessage = {
            status: 201,
            message: 'Successfully Create Partai',
            error: false,
          };
        });
      // .catch((err) => {
      //   responseWhenError = {
      //     status: 400,
      //     message: `${err}`,
      //     error: true,
      //   };
      // });
    } catch (err) {
      responseWhenError = {
        status: 400,
        message: `${err}`,
        error: true,
      };
    }

    return [responseModelOnyMessage, responseWhenError];
  }

  public async updatePartai(
    updateForm: PartaiForm,
    id: number
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      await prisma.partai
        .update({
          where: {
            id: Number(id),
          },
          data: {
            singkatan_partai: updateForm.singkatan_partai,
            nama_partai: updateForm.nama_partai,
            updatedAt: new Date(),
          },
        })
        .then(() => {
          responseModelOnlyMessage = {
            status: 200,
            message: 'Successfully Update Data',
            error: false,
          };
        })
        .catch((err) => {
          responseWhenError = {
            status: 400,
            message: `${err}`,
            error: true,
          };
        });
    } catch (err) {
      responseWhenError = {
        status: 500,
        message: `Something Went Wrong`,
        error: true,
      };
    }
    return [responseModelOnlyMessage, responseWhenError];
  }
}
