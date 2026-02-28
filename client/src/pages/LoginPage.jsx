import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function LoginPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.password) {
      toast.error('Email and password are required');
      return;
    }
    if (mode === 'signup' && form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSubmitting(true);
    try {
      const user =
        mode === 'login'
          ? await login({ email: form.email.trim(), password: form.password })
          : await signup({
              email: form.email.trim(),
              password: form.password,
              name: form.name.trim() || null,
            });

      toast.success(
        mode === 'signup'
          ? user.role === 'ADMIN'
            ? 'Signed up — you are the admin'
            : 'Welcome to Moji'
          : `Welcome back${user.name ? ', ' + user.name : ''}`
      );

      const goTo = user.role === 'ADMIN' && redirectTo === '/' ? '/admin' : redirectTo;
      navigate(goTo, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-kanji">門</div>
        <h1 className="auth-title">
          {isSignup ? 'Create account' : 'Welcome back'}
        </h1>
        <p className="auth-subtitle">
          {isSignup
            ? 'The first account created becomes the admin.'
            : 'Log in to manage your catalog or keep shopping.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name (optional)"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
            {submitting ? 'Please wait...' : isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="auth-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            className="auth-toggle-btn"
            onClick={() => setMode(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>

        <div className="auth-back">
          <Link to="/">← Back to shop</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
