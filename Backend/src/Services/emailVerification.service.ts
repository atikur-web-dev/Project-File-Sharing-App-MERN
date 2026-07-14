import jwt from 'jsonwebtoken';
import { User } from '../Models/user.schema.ts';
import { NotFoundError, ValidationError } from '../Utils/errors/httpErrors.ts';
import { config } from '../Config/config.ts';

export async function emailVerificationService(token: string): Promise<string> {
  let decode: any;
  try {
    decode = jwt.verify(token, config.ACCESS_TOKEN_SECRET_KEY);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ValidationError(
        {},
        'Validation Link expired, Please Again register plz',
      );
    }
    throw new ValidationError({}, 'Invalid Verification Link');
  }
  const user = await User.findOne({ email: decode.email });
  if (!user) {
    throw new NotFoundError({}, 'User is not found');
  }
  if (user.emailVerification) {
    return 'User is already verified';
  }
  user.emailVerification = new Date();
  await user.save({ validateBeforeSave: false });
  return 'Email verified successfully!';
}
