import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { config } from '../Config/config.js';
import { UnauthorizeError } from '../Utils/errors/httpErrors.js';
import { User } from '../Models/user.schema.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        displayName: string;
        email: string;
        emailVerification: Date | null;
        iat?: number;
        exp?: number;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      throw new UnauthorizeError(
        {},
        'Authentication required, Please Login to continue',
      );
    }
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizeError(
          {},
          'Your session has expired. Please login again',
        );
      }
      throw new UnauthorizeError({}, 'Invalid authentication token');
    }
    const user = await User.findById(decoded._id).select(
      '-password -refreshToken',
    );
    if (!user) {
      throw new UnauthorizeError(
        {},
        'User account not found. Please login again',
      );
    }
    req.user = {
      _id: user._id.toString(),
      displayName: user.displayName,
      email: user.email,
      emailVerification: user.emailVerification,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next();
    }
    try {
      const decoded = jwt.verify(
        token,
        config.ACCESS_TOKEN_SECRET_KEY,
      ) as JwtPayload;
      const user = await User.findById(decoded._id).select(
        '-password -refreshToken',
      );
      if (user) {
        req.user = {
          _id: user._id.toString(),
          displayName: user.displayName,
          email: user.email,
          emailVerification: user.emailVerification,
        };
      }
    } catch (err) {
      console.log('Optional auth Failed', err);
    }
  } catch (error) {
    next(error);
  }
};

export const requiredEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.emailVerification) {
    throw new UnauthorizeError(
      {},
      'Please Verify your email address to access this feature',
    );
  }
  next();
};
