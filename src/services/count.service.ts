import {
  ResponseModelWithData,
  ResponseWhenError,
} from '../constant/response_model';
import { prisma } from '../database/db';

export class CountingServiceImpl {
  public async getCount(): Promise<[ResponseModelWithData, ResponseWhenError]> {
    let responseModelWithData = {} as ResponseModelWithData;
    let responseWhenError = {} as ResponseWhenError;

    //Kalo Data Production Convert Floating To Number Harus Memakai new Array Function
    let newModel = new Array();

    try {
      await prisma.$queryRaw`SELECT pilihan_user, COUNT(*) AS Total_Suara, ROUND((COUNT(*) / (SELECT COUNT(*) FROM Partai)) * 100, 2) AS percentage FROM Pemilih GROUP BY pilihan_user ORDER BY pilihan_user;`
        .then((data: any) => {
          for (let i = 0; i < data.length; i++) {
            let lastModel = {
              pilihan_user: data[i].pilihan_user ?? 'Kosong',
              Total_Suara: String(data[i].Total_Suara) ?? 'Kosong',
              percentage: String(data[i].percentage) ?? 'Kosong',
            };
            newModel.push(lastModel);
          }
          responseModelWithData = {
            status: 200,
            data: newModel,
            message: 'Successfully Get Counting Election',
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

    return [responseModelWithData, responseWhenError];
  }
}
