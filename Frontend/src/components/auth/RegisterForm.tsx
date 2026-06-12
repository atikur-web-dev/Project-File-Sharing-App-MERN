// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../common/Button';
import { MaterialIcon } from '../common/MaterialIcon';
import { registerApi } from '../../api/authApi';
import type { RegisterFormData } from '../../types';

const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(3, 'Display name must be at least 3 characters')
    .max(50, 'Display name cannot exceed 50 characters')
    .trim()
    .regex(/^[a-zA-Z0-9\s\u0980-\u09FF]+$/, 'Special characters and emojis are not allowed'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
});

const getPasswordStrength = (password: string): { width: number; label: string; color: string } => {
  if (!password) return { width: 0, label: 'Weak', color: 'bg-error' };
  let score = 0;
  if (password.length > 5) score += 25;
  if (password.length > 8) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[^A-Za-z0-9]/.test(password)) score += 25;
  if (score <= 25) return { width: score, label: 'Weak', color: 'bg-error' };
  if (score <= 75) return { width: score, label: 'Fair', color: 'bg-on-secondary-container' };
  return { width: score, label: 'Strong', color: 'bg-secondary' };
};

interface RegisterFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

export const RegisterForm = ({ onSuccess, onLoginClick }: RegisterFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { displayName: '', email: '', password: '' },
  });

  const password = useWatch({ control, name: 'password', defaultValue: '' });
  const strength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await registerApi(data);
      onSuccess();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <header className="mb-xl">
        <h2 className="mb-xs text-headline-lg text-primary">Create an account</h2>
        <p className="text-body-md text-on-surface-variant">Start managing your files with precision.</p>
      </header>

      {serverError && (
        <div className="mb-lg rounded-lg border border-error-container bg-error-container/30 p-sm">
          <p className="text-center text-body-sm text-error">{serverError}</p>
        </div>
      )}

      <form className="space-y-lg" id="registerForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-xs">
          <label className="text-label-md text-on-surface-variant" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Ada Lovelace"
            className="stitch-input font-sans text-body-md"
            {...register('displayName')}
          />
          {errors.displayName && (
            <p className="text-label-sm text-error">{errors.displayName.message}</p>
          )}
        </div>

        <div className="space-y-xs">
          <label className="text-label-md text-on-surface-variant" htmlFor="email">
            Work Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="ada@company.com"
            className="stitch-input font-sans text-body-md"
            {...register('email')}
          />
          {errors.email && <p className="text-label-sm text-error">{errors.email.message}</p>}
        </div>

        <div className="space-y-xs">
          <div className="flex items-end justify-between">
            <label className="text-label-md text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <span className={`text-label-sm ${strength.color === 'bg-error' ? 'text-error' : strength.color === 'bg-secondary' ? 'text-secondary' : 'text-on-secondary-container'}`}>
              {strength.label}
            </span>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="stitch-input pr-10 font-sans text-body-md"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary"
            >
              <MaterialIcon name={showPassword ? 'visibility_off' : 'visibility'} size={18} />
            </button>
          </div>
          <div className="mt-2 overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className={`password-strength-bar h-0.5 transition-all duration-300 ${strength.color}`}
              style={{ width: `${strength.width}%` }}
            />
          </div>
          {errors.password && (
            <p className="text-label-sm text-error">{errors.password.message}</p>
          )}
          <p className="text-label-sm text-on-surface-variant/60">Minimum 8 characters with numbers.</p>
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
          Create Account
          {!isSubmitting && <MaterialIcon name="arrow_forward" size={18} className="ml-1" />}
        </Button>
      </form>

      <footer className="mt-xl flex flex-col items-center gap-md border-t border-outline-variant pt-lg">
        <p className="text-body-md text-on-surface-variant">
          Already have an account?{' '}
          <button type="button" onClick={onLoginClick} className="font-bold text-primary hover:underline">
            Log in
          </button>
        </p>
      </footer>
    </div>
  );
};
