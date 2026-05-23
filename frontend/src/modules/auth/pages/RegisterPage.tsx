import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { User, Eye, EyeOff } from 'lucide-react';
import { extractAuthErrorMessage, register, startGoogleLogin } from '../../../api/auth';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; confirmPassword?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setSubmitError('');
    setIsSubmitting(true);

    try {
      await register({ username, password });
      // After successful registration, always go to login page
      window.location.assign('/login');
    } catch (error) {
      setSubmitError(extractAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Heading */}
      <h1 className="font-display text-h1 text-primary mb-2">Create account</h1>
      <p className="text-body text-primary/50 font-body mb-8">
        Start organizing your life today.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {submitError && (
          <div className="rounded-md border border-red-400/30 bg-red-50 px-4 py-3 text-sm text-red-600 font-body">
            {submitError}
          </div>
        )}

        {/* Username */}
        <div className="relative">
          <Input
            label="Username"
            type="text"
            placeholder="your-username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            error={errors.username}
          />
          <User
            size={16}
            className="absolute right-3 top-[38px] text-primary/30"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-3 top-[38px] text-primary/30 hover:text-primary/60 transition-base cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Confirm password */}
        <div className="relative">
          <Input
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowPassword(s => !s)}
            className="absolute right-3 top-[38px] text-primary/30 hover:text-primary/60 transition-base cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Submit — Single Tertiary CTA */}
        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-primary/10" />
        <span className="font-mono text-label text-primary/30 uppercase">or</span>
        <div className="flex-1 h-px bg-primary/10" />
      </div>

      {/* Google signup */}
      <Button type="button" variant="secondary" className="w-full" onClick={startGoogleLogin}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>

      {/* Login link */}
      <p className="text-center mt-6 text-sm text-primary/50 font-body">
        Already have an account?{' '}
        <Link to="/login" className="text-secondary hover:text-tertiary transition-base font-medium">
          Sign in
        </Link>
      </p>
    </>
  );
}
