// Backend/src/Services/logout.service.ts
import { User } from '../Models/user.schema.js';
import { UnauthorizeError } from '../Utils/errors/httpErrors.js';

export async function logoutService(userID: string): Promise<void> {
  const result = await User.findByIdAndUpdate(
    userID,
    { refreshToken: null },
    { new: true }
  );

  if (!result) {
    throw new UnauthorizeError({}, 'User not found');
  }
}