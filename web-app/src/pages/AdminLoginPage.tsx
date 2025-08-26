
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { Logo, SpinnerIcon } from '../components/icons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <Logo className="w-16 h-16 mx-auto text-brand-primary" />
          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Admin Panel Sign-in
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Access the EasyOrganic Dashboard
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className='flex items-center justify-center gap-2'>
                    <SpinnerIcon className="h-5 w-5"/>
                    <span>Signing in...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
