import mongoose, { Schema, model } from "mongoose";
import type { IUser } from "../Types/schema.js";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../Config/config.ts";

const userSchema = new Schema<IUser>(
  {
    displayName: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true, 
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    emailVerification: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const hashPassword = await hash(this.password, 10);
    this.password = hashPassword;
  } catch (error) {
    console.log("Hashing failed", error);
    throw error;
  }
});

userSchema.methods.checkPassword = async function (
  password: string,
): Promise<boolean> {
  return await compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  const userId = this._id.toString();

  return jwt.sign(
    {
      _id: userId,
      displayName: this.displayName,
      email: this.email,
      emailVerification: this.emailVerification,
    },
    String(config.ACCESS_TOKEN_SECRET_KEY),
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRE as string | number,
    } as jwt.SignOptions,
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  const userId = this._id.toString();

  return jwt.sign(
    {
      _id: userId,
      email: this.email,
    },
    String(config.REFRESH_TOKEN_SECRET_KEY),
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRE as string | number,
    } as jwt.SignOptions,
  );
};

export const User =
  mongoose.models.User || model<IUser>("User", userSchema);
