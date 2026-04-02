import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, UserPlus, TrendingUp, User } from 'lucide-react';

export default function SignupPage({ onToggleAuthMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signup(email, password, name);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20 mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">FinDash</h1>
          <p className="text-surface-400 mt-2">Start your financial journey today</p>
        </div>

        {/* Signup Card */}
        <div className="glass-card p-8 border-surface-700/50 shadow-glass-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field w-full pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field w-full pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-700/50 text-center">
            <p className="text-surface-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={onToggleAuthMode}
                className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
