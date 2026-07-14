import { ZLoginUser } from '../Validators/auth.validator.js';
import type { LoginUserDTO } from '../Validators/auth.validator.js';
import { formatErrors } from '../Utils/errors/formatErrors.js';
import { ValidationError, NotFoundError } from '../Utils/errors/httpErrors.js';
import { User } from '../Models/user.schema.js';
import type { IUserResponse } from '../Types/schema.js';


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
