import { ZLoginUser } from '../Validators/auth.validator.ts';
import type { LoginUserDTO } from '../Validators/auth.validator.ts';
import { formatErrors } from '../Utils/errors/formatErrors.ts';
import { ValidationError, NotFoundError } from '../Utils/errors/httpErrors.ts';
import { User } from '../Models/user.schema.ts';
import type { IUserResponse } from '../Types/schema.d.ts';

interface LoginServiceResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}

export async function LoginService (
    userData : unknown
): Promise<LoginServiceResponse> {

    const validationResult = ZLoginUser.safeParse(userData);
    if (!validationResult.success) {
    const formattedErrors = formatErrors(validationResult.error);
    throw new ValidationError(formattedErrors, "Invalid login data");
  }
  const { email, password }: LoginUserDTO = validationResult.data;

 const user = await User.findOne({ email });
   if (!user) {
    throw new NotFoundError({}, "Invalid email or password");
  }

  const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
    throw new NotFoundError({}, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

    const userResponse: IUserResponse = {
    _id: user._id.toString(),
    displayName: user.displayName,
    email: user.email,
    emailVerification: user.emailVerification,
  };

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
}
