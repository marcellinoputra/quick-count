import {
  ResponseFailedValidation,
  ResponseModelOnlyMessage,
  ResponseModelWithToken,
  ResponseWhenError,
} from '../constant/response_model';
import { prisma } from '../database/db';
import { signInForm, signUpForm } from '../dto/auth.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthServiceImpl {
  public async signUp(
    signUpForm: signUpForm,
    hash: string
  ): Promise<[ResponseModelOnlyMessage, ResponseWhenError]> {
    let responseModelOnlyMessage = {} as ResponseModelOnlyMessage;
    let responseWhenError = {} as ResponseWhenError;

    try {
      await prisma.user
        .create({
          data: {
            username: signUpForm.username,
            password: hash,
          },
        })
        .then((data) => {
          responseModelOnlyMessage = {
            status: 201,
            message: 'Successfully Create Account',
            error: false,
          };
        });
    } catch (err) {
      responseWhenError = {
        status: 400,
        error: true,
        message: `${err}`,
      };
    }

    return [responseModelOnlyMessage, responseWhenError];
  }

  public async signIn(
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
        'secret',
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
}