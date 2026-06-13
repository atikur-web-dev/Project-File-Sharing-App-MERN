// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerApi } from '../../api/authApi';
import type { RegisterFormData } from '../../types';

const registerSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(3, 'Display name must be at least 3 characters')
    .max(50, 'Display name cannot exceed 50 characters')
    .trim(),
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

const getPasswordStrength = (password: string): { width: string; label: string; color: string } => {
  if (!password) return { width: '0%', label: 'Weak', color: '#ef4444' };
  let score = 0;
  if (password.length >= 8) score += 33;
  if (/[0-9]/.test(password)) score += 33;
  if (/[^A-Za-z0-9]/.test(password)) score += 34;
  
  if (score <= 33) return { width: '33%', label: 'Weak', color: '#ef4444' };
  if (score <= 66) return { width: '66%', label: 'Fair', color: '#f59e0b' };
  return { width: '100%', label: 'Strong', color: '#10b981' };
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
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
        <p className="text-sm text-gray-600">
          Start managing your files with precision.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{serverError}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Ada Lovelace"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('displayName')}
          />
          {errors.displayName && (
            <p className="mt-1 text-xs text-red-600">{errors.displayName.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Work Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="ada@company.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...register('email')}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            {password && (
              <span className={`text-xs font-medium`} style={{ color: strength.color }}>
                {strength.label}
              </span>
            )}
          </div>
          
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {/* Password Strength Bar */}
          {password && (
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-300 rounded-full"
                style={{ width: strength.width, backgroundColor: strength.color }}
              />
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Minimum 8 characters with uppercase, lowercase, number and special character.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onLoginClick}
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};