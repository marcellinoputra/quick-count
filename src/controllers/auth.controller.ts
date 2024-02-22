import { Request, Response } from 'express';
import { signInForm, signUpForm, updateAccountForm } from '../dto/auth.dto';
import { AuthServiceImpl } from '../services/auth.service';
import bcrypt from 'bcrypt';
import Joi from 'joi';

export class AuthController {
  /**
   * POST /v1/signup
   * @summary Create User
   * @tags Auth
   * @param {string} username.form.required - form username - application/x-www-form-urlencoded
   * @param {string} password.form.required - form password - application/x-www-form-urlencoded
   * @return {object} 201 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async signUp(req: Request, res: Response) {
    const signUpData: signUpForm = req.body;
    const authService = new AuthServiceImpl();

    const schema = Joi.object()
      .keys({
        username: Joi.string().min(10).required().messages({
          'string.min': 'Username Harus Memiliki 10 Characters',
          'any.required': 'Username Tidak Boleh Kosong',
        }),
        password: Joi.string().min(8).required().messages({
          'string.min': 'Password Harus Minimal 8 Characters',
          'any.required': 'Password Tidak Boleh Kosong',
        }),
      })
      .unknown(true);

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(signUpData.password, salt);

    const { error, value } = schema.validate(req.body);

    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join(','),
        error: true,
      });
    } else {
      const [responseModelOnlyMessage, responseWhenError] =
        await authService.SignUp(signUpData, hash);
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
   * POST /v1/signin
   * @summary Sign In User
   * @tags Auth
   * @param {string} username.form.required - form data - application/x-www-form-urlencoded
   * @param {string} password.form.required - form data - application/x-www-form-urlencoded
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async signIn(req: Request, res: Response) {
    const reqForm: signInForm = req.body;

    const schema = Joi.object()
      .keys({
        username: Joi.string().min(10).required().messages({
          'string.min': 'Username Harus Memiliki 10 Characters',
          'any.required': 'Username tidak boleh kosong',
        }),
        password: Joi.string().min(8).required().messages({
          'string.min': 'Password Harus Memiliki 8 Characters',
          'any.required': `Password tidak boleh kosong`,
        }),
      })
      .unknown(true);

    const authService = new AuthServiceImpl();

    const { error, value } = schema.validate(req.body);
    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join(','),
        error: true,
      });
    } else {
      const [responseModelWithToken, responseModelOnlyMessageError] =
        await authService.SignIn(reqForm);
      if (responseModelOnlyMessageError.error) {
        return res.status(responseModelOnlyMessageError.status).json({
          status: responseModelOnlyMessageError.status,
          message: responseModelOnlyMessageError.message,
        });
      } else {
        return res.status(responseModelWithToken.status).json({
          status: responseModelWithToken.status,
          data: responseModelWithToken.data,
          token: responseModelWithToken.token,
          message: responseModelWithToken.message,
        });
      }
    }
  }

  /**
   * PUT /v1/update/{id}
   * @summary Update User Account
   * @tags Auth
   * @param {number} id.path
   * @param {string} username.form.required - form data - application/x-www-form-urlencoded
   * @param {string} password.form.required - form data - application/x-www-form-urlencoded
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async UpdateAccount(req: Request, res: Response) {
    const updateForm: updateAccountForm = req.body;

    const { id } = req.params;

    const schema = Joi.object()
      .keys({
        username: Joi.string().min(10).required().messages({
          'string.min': 'Username Harus Memiliki 10 Characters',
          'any.required': 'Username Tidak Boleh Kosong',
        }),
        password: Joi.string().min(8).required().messages({
          'string.min': 'Password Harus Memiliki 8 Characters',
          'any.required': 'Password Tidak Boleh Kosong',
        }),
      })
      .unknown(true);

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(updateForm.password, salt);

    const authService = new AuthServiceImpl();
    const { error, value } = schema.validate(req.body);
    if (error != undefined) {
      return res.status(400).json({
        status: 400,
        message: error?.details.map((e) => e.message).join(','),
        error: true,
      });
    } else {
      const [responseModelOnlyMessage, responseWhenError] =
        await authService.UpdateAccount(updateForm, Number(id), hash);
      if (responseWhenError.error) {
        return res.status(responseWhenError.status).json({ responseWhenError });
      } else {
        return res
          .status(responseModelOnlyMessage.status)
          .json({ responseModelOnlyMessage });
      }
    }
  }

  /**
   * DELETE /v1/delete/{id}
   * @summary Delete Account
   * @tags Auth
   * @param {number} id.path
   * @return {object} 200 - success response - application/json
   * @return {object} 400 - bad request response
   * @return {object} 401 - token expired / not found
   */

  public async DeleteUser(req: Request, res: Response) {
    const { id } = req.params;

    const authService = new AuthServiceImpl();

    const [responseModelOnlyMessage, responseWhenError] =
      await authService.DeleteAccount(Number(id));

    if (responseWhenError.error) {
      return res.status(responseWhenError.status).json(responseWhenError);
    } else {
      return res
        .status(responseModelOnlyMessage.status)
        .json(responseModelOnlyMessage);
    }
  }
}
