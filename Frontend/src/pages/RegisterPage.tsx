// src/pages/RegisterPage.tsx
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <RegisterForm
      onSuccess={() =>
        navigate('/login', {
          state: {
            message: 'Registration successful. Please check your email to verify your account.',
          },
        })
      }
      onLoginClick={() => navigate('/login')}
    />
  );
};

export default RegisterPage;