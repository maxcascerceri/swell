import React, { useState } from 'react';
import { Button } from './Button';
import { Sparkles, X } from 'lucide-react';
import { authService } from '../services/authService';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  initialView: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: User) => void;
  onSwitchView: (view: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  initialView, 
  onClose, 
  onSuccess,
  onSwitchView 
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let user: User;
      if (initialView === 'signup') {
        user = await authService.signup(formData.firstName, formData.lastName, formData.email, formData.password);
      } else {
        user = await authService.login(formData.email, formData.password);
      }
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
        const user = await authService.loginWithGoogle();
        onSuccess(user);
        onClose();
    } catch (err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#154845]/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#154845]">
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FDF2F0] text-[#C26D53] mb-4">
                <Sparkles size={24} fill="currentColor" />
             </div>
             <h2 className="text-3xl font-extrabold text-[#154845]">
               {initialView === 'login' ? 'Welcome back' : 'Create your account'}
             </h2>
             <p className="text-[#64748B] mt-2 font-medium">
               {initialView === 'login' 
                 ? 'Log in to access your designs and credits.' 
                 : 'Get started with 1 free credit today.'}
             </p>
          </div>

          <div className="space-y-4">
            <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#334155] font-bold py-3 rounded-xl transition-colors"
            >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continue with Google
            </button>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E2E8F0]"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-[#94A3B8] font-bold">OR</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {initialView === 'signup' && (
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        type="text" 
                        placeholder="First name" 
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845]"
                        value={formData.firstName}
                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                    />
                    <input 
                        type="text" 
                        placeholder="Last name" 
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845]"
                        value={formData.lastName}
                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                    />
                </div>
              )}
              
              <input 
                type="email" 
                placeholder="Email address" 
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845]"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              
              <input 
                type="password" 
                placeholder="Password" 
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E2E8F0] focus:border-[#C26D53] focus:ring-0 outline-none font-medium text-[#154845]"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />

              {error && (
                <p className="text-red-500 text-sm font-bold text-center">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full py-4 text-lg shadow-lg"
                isLoading={isLoading}
              >
                {initialView === 'login' ? 'Log In' : 'Create Account'}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-[#64748B] font-medium">
              {initialView === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => onSwitchView(initialView === 'login' ? 'signup' : 'login')}
                className="text-[#C26D53] font-bold hover:underline"
              >
                {initialView === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};