import {
  ResponseFailedValidation,
  ResponseModelOnlyMessage,
  ResponseModelWithToken,
  ResponseWhenError,
} from '../constant/response_model';
import { prisma } from '../database/db';
import { signInForm, signUpForm, updateAccountForm } from '../dto/auth.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthServiceImpl {
  public async SignUp(
    signUpForm: signUpForm,
    hash: string
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      const checkExisitingUser = await prisma.user.findUnique({
        where: {
          username: signUpForm.username,
        },
      });

      if (checkExisitingUser) {
        responseWhenError = {
          status: 400,
          message: 'Username Already Exist',
          error: true,
        };
      } else {
        await prisma.user
          .create({
            data: {
              username: signUpForm.username,
              password: hash,
            },
          })
          .then(() => {
            responseModelOnlyMessage = {
              status: 201,
              message: 'Successfully Create Account',
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
      }
    } catch (err) {
      responseWhenError = {
        status: 500,
        message: `Something Went Wrong`,
        error: true,
      };
    }

    return [responseModelOnlyMessage, responseWhenError];
  }

  public async SignIn(
    signInForm: signInForm
  ): Promise<
    [ResponseModelWithToken, ResponseWhenError, ResponseFailedValidation]
  > {
    let responseModelWithToken = {} as ResponseModelWithToken;
    let responseModelWhenError = {} as ResponseWhenError;
    let responseFailedValidation = {} as ResponseFailedValidation;

    const checkExistingUser = await prisma.user.findFirst({
      where: {
        username: signInForm.username,
      },
    });

    if (checkExistingUser) {
      const checkPassword = bcrypt.compareSync(
        signInForm.password,
        checkExistingUser.password
      );

      let token = jwt.sign(
        {
          data: {
            id: checkExistingUser.id,
            username: checkExistingUser.username,
          },
        },
        `${process.env.JWT_TOKEN_SECRET}`,
        { expiresIn: '2h' }
      );

      if (checkPassword) {
        responseModelWithToken = {
          status: 200,
          data: checkExistingUser,
          token: token,
          message: 'Successfully Login',
          error: false,
        };
      } else {
        responseModelWhenError = {
          status: 400,
          error: true,
          message: 'Wrong Password',
        };
      }
    } else {
      responseModelWhenError = {
        status: 400,
        error: true,
        message: 'Username is not Registered',
      };
    }

    return [
      responseModelWithToken,
      responseModelWhenError,
      responseFailedValidation,
    ];
  }

  public async UpdateAccount(
    UpdateForm: updateAccountForm,
    id: number,
    hash: string
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      const checkExistingUser = await prisma.user.findUnique({
        where: {
          username: UpdateForm.username,
        },
      });

      if (checkExistingUser) {
        responseWhenError = {
          status: 400,
          message: 'Username Already Exist',
          error: true,
        };
      } else {
        await prisma.user
          .update({
            where: {
              id: Number(id),
            },
            data: {
              username: UpdateForm.username,
              password: hash,
              updatedAt: new Date(),
            },
          })
          .then(() => {
            responseModelOnlyMessage = {
              status: 200,
              message: 'Successfully Update Account',
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
      }
    } catch (err) {
      responseWhenError = {
        status: 500,
        message: 'Something Went Wrong',
        error: true,
      };
    }

    return [responseModelOnlyMessage, responseWhenError];
  }

  public async DeleteAccount(
    id: number
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      await prisma.user
        .delete({
          where: {
            id: Number(id),
          },
        })
        .then((data) => {
          responseModelOnlyMessage = {
            status: 200,
            message: 'Succesfully Delete Account',
            error: false,
          };
        })
        .catch((err) => {
          responseWhenError = {
            status: 400,
            message: `Failed to Delete Account Because ${err}`,
            error: true,
          };
        });
    } catch (err) {
      responseWhenError = {
        status: 400,
        message: 'Something Went Wrong',
        error: true,
      };
    }

    return [responseModelOnlyMessage, responseWhenError];
  }
}
