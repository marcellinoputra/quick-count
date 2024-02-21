import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export class middlewareAuth {
  public authenticationToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
      return res.status(400).json({
        message: 'Token Not Found',
      });
    }

    jwt.verify(token, 'secret', (err, result) => {
      if (err) {
        return res.status(401).json({
          message: 'User Unauthorized',
        });
      }
    });

    next();
  }
}
