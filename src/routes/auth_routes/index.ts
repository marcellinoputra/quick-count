import { Express } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { middlewareAuth } from '../../middleware/auth';

enum AuthR {
  SIGNIN = '/v1/signin',
  SIGNUP = '/v1/signup',
  UPDATE = '/v1/update/:id',
  DELETE = '/v1/delete/:id',
}

export default function AuthRoutes(
  app: Express,
  authController: AuthController,
  middlewareAuth: middlewareAuth
) {
  app.post(AuthR.SIGNUP, authController.signUp);
  app.post(AuthR.SIGNIN, authController.signIn);
  app.put(
    AuthR.UPDATE,
    authController.UpdateAccount,
    middlewareAuth.authenticationToken
  );
  app.delete(
    AuthR.DELETE,
    authController.DeleteUser,
    middlewareAuth.authenticationToken
  );
}
