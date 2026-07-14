import jwt from "jsonwebtoken";
import { config } from "../Config/config.js";
import { User } from "../Models/user.schema.js";
import { UnauthorizeError } from "../Utils/errors/httpErrors.js";

interface RefreshTokenPayload extends jwt.JwtPayload {
  _id: string;
  email: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function refreshTokenService(
  incomingRefreshToken: string
): Promise<RefreshTokenResponse> {
  if (!incomingRefreshToken) {
    throw new UnauthorizeError({}, "Refresh token is required");
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      config.REFRESH_TOKEN_SECRET_KEY
    ) as RefreshTokenPayload;

    const user = await User.findById(decoded._id).select("+refreshToken");

    if (!user) {
      throw new UnauthorizeError({}, "User not found");
    }

    if (!user.refreshToken) {
      throw new UnauthorizeError({}, "No refresh token found. Please login again");
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new UnauthorizeError(
        {},
        "Invalid or expired refresh token"
      );
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizeError(
        {},
        "Refresh token has expired. Please login again"
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizeError({}, "Invalid refresh token");
    }

    throw error;
  }
}
