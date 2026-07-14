import { ZRegisterUser } from '../Validators/auth.validator.js';
import type { RegisterUserDTO } from '../Validators/auth.validator.js';
import { formatErrors } from '../Utils/errors/formatErrors.js';
import { ValidationError } from '../Utils/errors/httpErrors.js';
import { User } from '../Models/user.schema.js';
import type { IUserResponse } from '../Types/schema.js';
import { generateVerificationLink } from '../Utils/generateEmailVerificationLink.js';
import { sendMail } from '../Config/mailConfig.js';
import { emailVerificationTemplate } from '../templates/email-templates/emailVerification.js';


export async function registerService(
  userData: unknown,
): Promise<IUserResponse> {
  const validationResult = ZRegisterUser.safeParse(userData);
  if (!validationResult.success) {
    const formattedErrors = formatErrors(validationResult.error);
    throw new ValidationError(formattedErrors, 'Invalid registration data');
  }
  const validatedData: RegisterUserDTO = validationResult.data;
  const existingUser = await User.findOne({ email: validatedData.email });

  if (existingUser) {
    throw new ValidationError(
      { email: ['Email already exists'] },
      'Email already registered',
    );
  }

  try {
    const newUser = await User.create(validatedData);
    try {
      const verifyLink = generateVerificationLink(newUser.email);
      const emailTemplate = emailVerificationTemplate(
        verifyLink,
        newUser.displayName,
      );
      sendMail([newUser.email], 'Verify Your Email', emailTemplate).catch(
        (err) => {
          console.error('Failed to send verification email:', err);
        },
      );
    } catch (emailError) {
      console.error('Email verification setup failed:', emailError);
    }
    const userResponse: IUserResponse = {
      _id: newUser._id.toString(),
      displayName: newUser.displayName,
      email: newUser.email,
      emailVerification: newUser.emailVerification,
    };

    return userResponse;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ValidationError(
        { email: ['Email already exists'] },
        'Email already registered',
      );
    }
    throw error;
  }
}
