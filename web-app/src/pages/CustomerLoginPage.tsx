
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../hooks/useCustomerAuth';
import { Logo, SpinnerIcon } from '../components/icons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const CustomerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useCustomerAuth();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-slate-50 py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md mx-4">
        <div className="text-center">
            <Link to="/" className="inline-block">
                <Logo className="w-16 h-16 mx-auto text-brand-primary" />
            </Link>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            Welcome Back!
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to continue shopping.
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
            placeholder="you@example.com"
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
          <p className="text-sm text-center text-slate-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-brand-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
