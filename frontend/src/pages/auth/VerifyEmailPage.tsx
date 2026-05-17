import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authService } from '@/services/authService';
import { Loader2, Check, X } from 'lucide-react';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully');
      } catch (err) {
        setStatus('error');
        setMessage(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
          Verifying Your Email
        </h2>
        <p className="text-gray-600">Please wait...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
          Email Verified!
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
        >
          Continue to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <X className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-heading font-bold text-gray-800 mb-2">
        Verification Failed
      </h2>
      <p className="text-gray-600 mb-6">{message}</p>
      <Link
        to="/login"
        className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition"
      >
        Go to Login
      </Link>
    </div>
  );
}
