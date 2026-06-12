// src/components/auth/LoginForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../common/Button";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../hooks/useAuth";
import type { LoginFormData } from "../../types";
import { FcGoogle } from "react-icons/fc";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required"),
});

interface LoginFormProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick?: () => void;
}

export const LoginForm = ({
  onSuccess,
  onRegisterClick,
  onForgotPasswordClick,
}: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const user = await loginApi(data);
      setUser(user);
      onSuccess();
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Invalid email or password",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-card w-full max-w-[400px] rounded-xl border border-outline-variant bg-surface-container-lowest p-xl">
      <form className="space-y-lg" onSubmit={handleSubmit(onSubmit)}>
        {serverError && (
          <div className="rounded-lg border border-error-container bg-error-container/30 p-sm">
            <p className="text-center text-body-sm text-error">{serverError}</p>
          </div>
        )}

        <div className="space-y-xs">
          <label
            className="text-label-md text-on-surface-variant"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="yourname@example.com"
            className="stitch-input"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-label-sm text-error">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-xs">
          <div className="flex items-center justify-between">
            <label
              className="text-label-md text-on-surface-variant"
              htmlFor="password"
            >
              Password
            </label>
            {onForgotPasswordClick && (
              <button
                type="button"
                onClick={onForgotPasswordClick}
                className="text-label-md text-on-surface-variant transition-colors hover:text-primary"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="stitch-input pr-10"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
              tabIndex={-1}
            >
              {showPassword ? (
                <IoEyeOffOutline size={18} />
              ) : (
                <IoEyeOutline size={18} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-label-sm text-error">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
        >
          Log in
        </Button>

        <div className="relative flex items-center py-sm">
          <div className="grow border-t border-outline-variant" />
          <span className="mx-md text-label-sm text-outline">OR</span>
          <div className="grow border-t border-outline-variant" />
        </div>

        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md text-primary transition-all hover:bg-surface-container-low active:scale-[0.98]"
        >
          <FcGoogle className="h-5 w-5" />
          Continue with Google
        </button>
      </form>

      <div className="mt-xl text-center">
        <p className="text-body-sm text-on-surface-variant">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onRegisterClick}
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
