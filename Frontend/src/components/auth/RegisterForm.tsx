// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { registerApi } from '../../api/authApi';
import type { RegisterFormData } from '../../types';

const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(3, 'Display name must be at least 3 characters')
    .max(50, 'Display name cannot exceed 50 characters')
    .trim()
    .regex(
      /^[a-zA-Z0-9\s\u0980-\u09FF]+$/,
      'Special characters and emojis are not allowed'
    ),
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
interface PasswordRequirement {
  label: string;
  check: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', check: (p) => p.length >= 8 },
  { label: 'One uppercase letter', check: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter', check: (p) => /[a-z]/.test(p) },
  { label: 'One number', check: (p) => /\d/.test(p) },
  { label: 'One special character', check: (p) => /[^A-Za-z\d]/.test(p) },
];

const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  const passed = passwordRequirements.filter((req) => req.check(password)).length;
  return (passed / passwordRequirements.length) * 100;
};

const getStrengthColor = (strength: number): string => {
  if (strength < 40) return 'bg-red-500';
  if (strength < 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

const getStrengthLabel = (strength: number): string => {
  if (strength < 40) return 'Weak';
  if (strength < 80) return 'Medium';
  return 'Strong';
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
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
    },
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
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" padding="lg">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Join FileShare to start sharing files
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400 text-center">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Display Name"
          type="text"
          placeholder="John Doe"
          leftIcon={<UserIcon className="w-5 h-5" />}
          error={errors.displayName?.message}
          {...register('displayName')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<EnvelopeIcon className="w-5 h-5" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            leftIcon={<LockClosedIcon className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />

          {password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor(strength)}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {getStrengthLabel(strength)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {passwordRequirements.map((req, index) => {
                  const isMet = req.check(password);
                  return (
                    <div key={index} className="flex items-center gap-1.5">
                      {isMet ? (
                        <CheckCircleIcon className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      ) : (
                        <XCircleIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      )}
                      <span
                        className={`text-xs ${
                          isMet
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Sign in
          </button>
        </p>
      </div>
    </Card>
  );
};